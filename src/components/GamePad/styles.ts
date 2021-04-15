import styled from 'styled-components/native';

interface IPlateProps {
  size: number;
}

interface IHandlerProps {
  size: number;
}

export const Plate = styled.View<IPlateProps>`
  align-items: center;
  justify-content: center;

  height: ${props => props.size}px;
  width: ${props => props.size}px;
  border-radius: ${props => props.size / 2}px;
  background-color: rgba(255, 255, 255, 0.3);
`;

export const Handler = styled.View<IHandlerProps>`
  align-items: center;
  justify-content: center;

  height: ${props => props.size / 2}px;
  width: ${props => props.size / 2}px;
  border-radius: ${props => props.size / 4}px;
  background-color: rgba(0, 0, 0, 0.75);
  border: 5px solid rgba(0, 0, 0, 0.6);
`;
