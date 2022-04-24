import styled from 'styled-components';

const CalendarHeaderContainer = styled.header`
    display: flex;
    width: 100%;
    height: 100px;
    justify-content: center;
    align-items: center;

    .icon_arrow {
        font-size: 4rem;
        cursor: pointer;
    }

    .month {
        width: 500px;
        padding: 0 2rem;
        margin: 0;
        margin-bottom: 1rem;
        font-size: 5rem;
        text-align: center;

        .highlight {
            color: #ff9999;
        }
    }
`;

export default CalendarHeaderContainer;
