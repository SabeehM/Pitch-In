import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import {Container} from "reactstrap";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;`;

export default class LoadingScreen extends React.Component {
    render() {
        return (
            <Container className="loading-screen">
                <h1>LOADING...</h1>
            <div className="sweet-loading">
                <ClipLoader
                    css={override}
                    size={150}
                    color={"#000"}
                    loading= {true}
                />
            </div>
            </Container>
        )}
    }
  