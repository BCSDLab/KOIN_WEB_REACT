export default [
  {
    'title': '학교정보',
    'planFlag': false,
    'submenu': [
      {
        'title': '주변상점',
        'link': 'store',
        'newFlag': false,
        'planFlag': false,
        'tag': null
      },
      {
        'title': '버스/교통',
        'link': 'bus',
        'newFlag': false,
        'planFlag': false,
        'tag': null
      },
      {
        'title': '식단',
        'link': 'diet',
        'newFlag': false,
        'planFlag': false,
        'tag': null
      },
      {
        'title': 'FAQ',
        'link': 'faq',
        'newFlag': false,
        'planFlag': false,
        'tag': null
      },
      {
        'title': '동아리',
        'link': 'circle',
        'newFlag': false,
        'planFlag': false,
        'tag': null
      },
      {
        'title': '복덕방',
        'link': 'room',
        'newFlag': false,
        'planFlag': false,
        'tag': null
      },
      {
        'title': '시간표',
        'link': 'timetable',
        'newFlag': true,
        'planFlag': false,
        'tag': null
      }
    ]
  },
  {
    'title': '커뮤니티',
    'planFlag': false,
    'submenu': [
      {
        'title': '공지사항',
        'link': '/board/notice',
        'tag': 4,
        'newFlag': false,
        'planFlag': false
      },
      {
        'title': '자유게시판',
        'link': '/board/free',
        'tag': 1,
        'newFlag': false,
        'planFlag': false
      },
      {
        'title': '취업게시판',
        'link': '/board/job',
        'newFlag': false,
        'tag': 2,
        'planFlag': false
      },
      {
        'title': '익명게시판',
        'tag': -1, //원래 3
        'link': '/board/anonymous',
        'newFlag': false,
        'planFlag': false
      },
      {
        'title': '질문게시판',
        'tag': 10,
        'link': '/board/question',
        'newFlag': false,
        'planFlag': false,
      },
      {
        'title': '분실물',
        'tag': 5,
        'link': '/lost',
        'newFlag': false,
        'planFlag': false
      },
    ]
  },
  /*
  {
    'title': '평가시스템',
    'planFlag': true,
    'submenu': [
      {
        'title': '교수 평가',
        'tag': null,
        'link': '',
        'newFlag': false,
        'planFlag': true
      },
      {
        'title': '강의 평가',
        'tag': null,
        'link': '',
        'newFlag': false,
        'planFlag': true
      }
    ]
  },*/
  {
    'title': '중고장터',
    'newFlag': false,
    'planFlag': false,
    'submenu': [
      {
        'title': '팝니다',
        'tag': null,
        'link': 'market/sell',
        'newFlag': false,
        'planFlag': false
      },
      {
        'title': '삽니다',
        'tag': null,
        'link': 'market/buy',
        'newFlag': false,
        'planFlag': false
      }
    ]
  },
  /*
  {
    'title': '부동산',
    'planFlag': true,
    'submenu': [
      {
        'title': '원룸정보',
        'tag': null,
        'link': 'room-list',
        'newFlag': false,
        'planFlag': false
      },
      {
        'title': '거래게시판',
        'tag': null,
        'link': '',
        'newFlag': false,
        'planFlag': true
      }
    ]
  }
  */
]