import styled, { keyframes, css } from "styled-components";

const navOn = keyframes`
    from {margin-left: -250px;}
    to {margin-left: 0;}
`;

const navOff = keyframes`
    from {margin-left: 0;}
    to {margin-left: -250px;}
`;

export default styled.nav`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(85 104 100 / 65%);
    /* width: 270px; */
    height: 100vh;
    border-top-right-radius: 30px;
    animation: ${(props) =>
    props.navFlag
    ? css`
        ${navOn} 0.4s ease-out forwards
        `
    : css`
        ${navOff} 0.4s ease-out forwards
        `};

    /* & > img {
        position: fixed;
        left: 200px;
        top: 20px;
        width: 20px;
        height: 20px;
        animation: ${(props) =>
        props.navFlag
            ? css`
                ${navOn} 0.4s ease-out forwards
            `
            : css`
                ${navOff} 0.4s ease-out forwards
            `};
        cursor: pointer;
    }

    & > img:hover {
        transform: scale(1.1);
    } */
`;
