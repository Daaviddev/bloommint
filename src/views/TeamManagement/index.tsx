import React from "react";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import "./teamManagement.scss";
import { Table } from "reactstrap";

export interface ITop10Data {
    id: number;
    name: string;
    teamMemebers: number;
    airdropsSent: number;
}

const data: ITop10Data = {
    id: 0,
    name: "Mon",
    teamMemebers: 5,
    airdropsSent: 10,
};

function TeamManagement() {
    return (
        <>
            <Container className="teamContainer">
                <Row className="teamRow">
                    <Col className="teamCol" md={6} sm={12}>
                        <Table className="teamTable">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Members</th>
                                    <th>Airdrops</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </Table>
                    </Col>
                    <Col className="teamCol" md={6} sm={12}></Col>
                </Row>
            </Container>
        </>
    );
}

export default TeamManagement;
