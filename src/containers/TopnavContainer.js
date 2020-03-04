import React, { useState, useEffect, useCallback } from 'react'
import Topnav from '../components/Topnav';
import * as CATEGORY from '../static/category';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../modules/auth';
import { useToasts } from 'react-toast-notifications';
import MobileFooterMenu from '../components/MobileFooterMenu';
import { toggleSheetOpen } from '../modules/timetable';
import { updateFooterMenu } from '../modules/common';

export default function TopnavContainer({ history, path }) {
  const { addToast } = useToasts();
  const categories = CATEGORY.default;
  const [menu, setMenu] = useState("");
  const [searchWord, setSearchWord] = useState('');
  const [searchWordList, setSearchWordList] = useState(null);
  const [searchBar, setSearchBar] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { token, data, userInfo } = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  const onMouseOverMenu = useCallback(menu => {
    setMenu(menu);
  }, []);

  const onLogout = useCallback(() => {
    dispatch(logout({ 
      token: sessionStorage.getItem("token")
    }));
  }, []);

  const onClickMultiPurposeBtn = useCallback(() => {
    if (path === '/timetable') {
      dispatch(toggleSheetOpen());
    } else {
      const userInfo = sessionStorage.getItem("userInfo");
      if (!userInfo) {
        if (window.confirm("로그인이 필요합니다. 로그인 하시겠습니까?")){
          history.push('/login');
        }
        return;
      }
      if (path === '/board/promotion' && JSON.parse(userInfo).identity !== 5) {
        alert("점주만이 홍보게시글을 작성할 수 있습니다.");
        return;
      }
      history.push(`${path}/register`);
    }
  }, [path]);

  const onClickFooterMenu = useCallback(idx => {
    dispatch(updateFooterMenu(idx));
  }, []);

  const onClickSearchButton = useCallback(searchWord => {
    // 검색
    if (!searchWord || !searchWord.length) {
      addToast("검색어를 입력해주세요.", {
        appearance: "warning",
        autoDismiss: true
      });
      return;
    }
    if (sessionStorage.getItem("search-query")) {
      let searchQuery = JSON.parse(sessionStorage.getItem("search-query"));
      if (searchQuery.includes(searchWord)) {
        searchQuery.splice(searchQuery.indexOf(searchWord), 1);
        searchQuery.unshift(searchWord);
      } else {
        if (searchQuery.length === 5) {
          searchQuery.pop();
        } 
        searchQuery.unshift(searchWord);
      }
      setSearchWordList(searchQuery);
      sessionStorage.setItem("search-query", JSON.stringify(searchQuery));
    } else {
      let searchQuery = [searchWord];
      setSearchWordList(searchQuery);
      sessionStorage.setItem("search-query", JSON.stringify(searchQuery));
    }
    history.push(`/search?q=${searchWord}`);
    setSearchWord('');
    setSearchBar(false);
  }, []);

  const onClickDeleteSearchWordBtn = useCallback(searchWord => {
    console.log(searchWord);
    if (!searchWord) {
      sessionStorage.removeItem('search-query');
      setSearchWordList(null);
    } else {
      let searchQuery = JSON.parse(sessionStorage.getItem("search-query"));
      searchQuery.splice(searchQuery.indexOf(searchWord), 1);
      setSearchWordList(searchQuery);
      sessionStorage.setItem("search-query", JSON.stringify(searchQuery));
    }
  }, []);

  const onChangeSearchWord = useCallback(e => {
    setSearchWord(e.target.value);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("search-query")) {
      setSearchWordList(JSON.parse(sessionStorage.getItem('search-query')));
    }
  }, []);

  useEffect(() => {
    if (data && data.data.success === 'logout') {
      addToast('성공적으로 로그아웃했습니다.', {
        appearance: 'success',
        autoDismiss: true
      });
    }
  }, [data]);

  return (
    <>
      <Topnav
        categories={categories}
        menu={menu}
        path={path}
        onMouseOverMenu={onMouseOverMenu}
        token={token}
        userInfo={userInfo}
        onLogout={onLogout}
        mobileMenu={mobileMenu}
        searchWord={searchWord}
        searchWordList={searchWordList}
        searchBar={searchBar}
        setMobileMenu={setMobileMenu}
        setSearchBar={setSearchBar}
        onClickMultiPurposeBtn={onClickMultiPurposeBtn}
        onClickDeleteSearchWordBtn={onClickDeleteSearchWordBtn}
        onClickFooterMenu={onClickFooterMenu}
        onClickSearchButton={onClickSearchButton}
        onChangeSearchWord={onChangeSearchWord}
      />
      <MobileFooterMenu
        history={history}
        path={path}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        onClickFooterMenu={onClickFooterMenu}
        searchBar={searchBar}
        setSearchBar={setSearchBar}
      />
    </>
  )
}
