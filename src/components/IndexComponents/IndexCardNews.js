import React from "react";
import styled from "styled-components";

const Container = styled.section`
  width: 295px;
  height: 189px;
  cursor: pointer;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
`

export default React.memo(function IndexCardNews({
  imgLink,
  newsLink
}) {
  return (
    <Container onClick={() => window.open(newsLink)}>
      {imgLink &&
        <Thumbnail src={imgLink}/>
      }
    </Container>
  )
})
