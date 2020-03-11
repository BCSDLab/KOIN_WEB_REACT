import React, { useState, useEffect, useRef } from 'react';
import PromotionEdit from '../../components/PromotionComponents/PromotionEdit';
import { useDispatch, useSelector } from 'react-redux';
import {adjustPromotion, getPromotion, checkPromotionPermission, getMyStore} from '../../modules/promotion';
import { useToasts } from 'react-toast-notifications';
import { marketAPI } from '../../api'
import Header from '../../components/BoardComponents/Header';
import ButtonGroup from '../../components/BoardComponents/ButtonGroup';

export default function PromotionEditContainer({ history, match }) {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const { data, error, post, myStore } = useSelector(state => state.promotionReducer);
  const [helpButtontonFlag, setHelpButtonFlag] = useState(false);
  const [shops, setShops] = useState([]);
  const [promotion, setPromotion] = useState({
    title: '',
    summary: '',
    content: '',
    start: '',
    end: '',
    shop: '',
    nickname: ''
  });
  const editorRef = useRef();
  const modules = {
    toolbar: {
      container: [
        [{'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'color': []}, {'background':[]}],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['image', 'video']
      ]
    }
  }

  const onChangeItem = e => {
    const target = e.target;
    if (target) {
      setPromotion(promotion =>({
        ...promotion,
        [target.name]: target.value
      }));
    } else {
      setPromotion(promotion =>({
        ...promotion,
        content: e
      }));
    }
  }

  const onClickHelpButton = e => {
    e.stopPropagation();
    setHelpButtonFlag(value => !value)
  };

  const onClickEditButton = () => {
    console.log('수정 버튼 클릭')
    const {title, content, summary, start, end, shop } = promotion;
    if (title === "" || content === "") {
      addToast('제목과 내용을 채워주세요', {
        appearance: 'warning',
        autoDismiss: true
      });
      return;
    }
    if (title.length > 20) {
      addToast(`제목 길이는 최대 20자 입니다. 지금 제목의 길이는 ${title.length}자 입니다.`, {
        appearance: 'warning',
        autoDismiss: true
      });
      return;
    }
    if (summary.length > 50) {
      addToast(`홍보 문구 길이는 최대 50자 입니다. 지금 제목의 길이는 ${summary.length}자 입니다.`, {
        appearance: 'warning',
        autoDismiss: true
      });
      return;
    }

    const today = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).getTime();
    const startDate = new Date(start);
    const startTime = startDate.getTime();
    startDate.setMonth(startDate.getMonth() + 1);
    const limitTime = startDate.getTime();
    const endTime = (new Date(end)).getTime();
    if (endTime <= startTime) {
      addToast('시작 일자는 종료 일자보다 앞서야 합니다.', {
        appearance: 'warning',
        autoDismiss: true
      })
      return;
    }
    if (endTime >= limitTime) {
      addToast('최대 홍보 기간은 한 달입니다.', {
        appearance: 'warning',
        autoDismiss: true
      })
      return;
    }
    if (endTime <= today) {
      addToast('종료 일자는 오늘 이후여야 합니다.', {
        appearance: 'warning',
        autoDismiss: true
      })
      return;
    }
    const link = content.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,256}\b(\/?[-a-zA-Z0-9@:;|_\+.~#%?&//=]*)?/gi)

    dispatch(adjustPromotion({
      body: {
        title,
        event_title: summary,
        content,
        start_date: start,
        end_date: end,
        shop_id: Number(shop),
        thumbnail: link.find(
          value => value.indexOf('static.koreatech') !== -1 &&
            (value.indexOf('.png') !== -1 || value.indexOf('.jpg') !== -1 || value.indexOf('.jpeg') !== -1 ||
              value.indexOf('.gif') !== -1 || value.indexOf('.bmp') !== -1 || value.indexOf('.raw') !== -1 || value.indexOf('.svg') !== -1 ||
              value.indexOf('.PNG') !== -1 || value.indexOf('.JPG') !== -1 || value.indexOf('.JPEG') !== -1 ||
              value.indexOf('.GIF') !== -1 || value.indexOf('.BMP') !== -1 || value.indexOf('.RAW') !== -1 || value.indexOf('.SVG') !== -1)
        )
      },
      id: sessionStorage.getItem("postId"),
      token: sessionStorage.getItem("token")
    }))
  };

  const onClickCancelButton = () => {
    history.goBack();
  };


  function imageUpload ()  {
    const _this = this;
    const editor = editorRef.current;
    let formData = new FormData();
    let fileInput = document.createElement('input');
    const range = editor.getEditor().getSelection();

    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('style', 'display: none');
    fileInput.setAttribute('accept', 'image/png', 'image/gif', 'image/jpeg', 'image/bmp', 'image/x-icon');

    fileInput.addEventListener('change', async () => {
      formData.append('image', fileInput.files[0]);
      try {
        const result = await marketAPI.uploadImage(sessionStorage.getItem("token"), formData)
        _this.quill.insertEmbed(range.index, 'image', result.data.url[0]);
      } catch(e) {
        addToast("이미지의 크기가 너무 큽니다.", {
          appearance: 'error',
          autoDismiss: true
        });
      }
    });
    fileInput.click();
  }

  useEffect(() => {
    if(sessionStorage.getItem("token")){
      if (!sessionStorage.getItem("postId")) {
        alert("선택된 게시글이 없습니다.");
        history.goBack();
      }

      dispatch(checkPromotionPermission({
        token: sessionStorage.getItem("token"),
        id: sessionStorage.getItem("postId")
      }))
    }
    window.addEventListener('click' , () => {
      setHelpButtonFlag(false)
    })

    return () => {
      console.log("out")
      window.removeEventListener('click' , () => {
        setHelpButtonFlag(false)
      })
    }
  }, []);

  useEffect(() => {
    if (data) {
      if (data.grantEdit) {
        console.log(data)
        dispatch(getPromotion({
          id: sessionStorage.getItem("postId"),
          token: sessionStorage.getItem("token")
        }))
        dispatch(getMyStore({
          token: sessionStorage.getItem("token")
        }))
      }
      if (data.status === 201) {
        addToast("게시글을 수정했습니다", {
          appearance: 'success',
          autoDismiss: true
        });
      }
    }
  }, [data]);

  useEffect(() => {
    if (post.data) {
      console.log(post)
      setPromotion({
        title: post.data.title,
        summary: post.data.event_title,
        content: post.data.content,
        start: post.data.start_date,
        end: post.data.end_date,
        shop: String(post.data.shop_id),
        nickname: post.data.nickname
      });
    }
  }, [post])

  useEffect(() => {
    if (error) {
      addToast("게시글 수정 중 에러가 발생했습니다.", {
        appearance: 'error',
        autoDismiss: true
      });
    }
  }, [error]);

  useEffect(() => {
    if(myStore.data) {
      setShops(myStore.data)
    }
    if(myStore.error) {
      addToast("내 상점을 불러오는 중 에러가 발생했습니다.", {
        appearance: 'error',
        autoDismiss: true
      });
    }
  }, [myStore]);

  return (
    <>
      <Header
        match={match}
        history={history}>
        <ButtonGroup
          match={match}
          history={history}
        />
      </Header>
      <PromotionEdit
        type="수정"
        promotion={promotion}
        shops={shops}
        helpButtonFlag={helpButtontonFlag}
        editorRef={editorRef}
        modules={modules}
        match={match}
        imageUpload={imageUpload}
        onChangeItem={onChangeItem}
        onClickHelpButton={onClickHelpButton}
        onClickEditButton={onClickEditButton}
        onClickCancelButton={onClickCancelButton} />
    </>
  )
}
