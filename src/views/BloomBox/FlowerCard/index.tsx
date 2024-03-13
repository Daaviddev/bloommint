import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppBar, Toolbar, SvgIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import plain from "../../../assets/flowers/1.png";
import glade from "../../../assets/flowers/2.png";
import camp from "../../../assets/flowers/3.png";
import lumberjack from "../../../assets/flowers/4.png";
import valley from "../../../assets/flowers/5.png";
import settlement from "../../../assets/flowers/6.png";
import FlowerButton from "../ToolBar/flowerButton";
import { trim } from "../../../helpers";
import { IReduxState } from "../../../store/slices/state.interface";
import { IAccountSlice, IFlowerInfoDetails } from "../../../store/slices/account-slice";
import { BorderAll } from "@material-ui/icons";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import "./flowerCard.scss";

interface IFloweCardProps {
    planet: IFlowerInfoDetails;
}

function FlowerCard({ planet }: IFloweCardProps) {
    const tierImg = [plain, glade, camp, lumberjack, valley, settlement];
    const tierLabel = ["Plain", "Glade", "Camp", "Lumberjack", "Valley", "Settlement"];
    const mimPrice = useSelector<IReduxState, number>(state => state.app.mimPrice);
    const marketPrice = useSelector<IReduxState, number>(state => state.app.marketPrice);

    const getTierLevel = (reward: number) => {
        const amount = reward - 100000;
        if (amount === 0) return 0;
        else if (amount < 5000) return 1;
        else if (amount < 10000) return 2;
        else if (amount < 20000) return 3;
        else if (amount < 30000) return 4;
        else if (amount < 40000) return 5;
        else return 0;
    };

    const getBonus = (reward: number) => {
        return (reward - 100000) / 1000;
    };

    const getActionTime = () => {
        const actionTime = planet.lastProcessingTimestamp + planet.compoundDelay;
        // return actionTime == 0 ? "0" : new Date(actionTime * 1000).toISOString().substring(11, 19);
        return actionTime <= 0 ? 0 : actionTime;
    };

    const getTimeLeft = () => {
        const timestamp = getActionTime() - Math.floor(Date.now() / 1000);
        return timestamp <= 0 ? 0 : timestamp;
    };

    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    const id = 1;

    useEffect(() => {
        let timer = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    });

    const className = timeLeft == 0 ? "dapp-topbar-btns-wrap" : "dapp-topbar-btns-wrap-full";

    return (
        <>
            <Container className="cardContainer" data-tilt>
                <Row className="cardRow">
                    <p className="flower-name">{planet.name}</p>
                </Row>
                <Row className="cardRow">
                    <Col className="left" md={12} xl={3} lg={6} xs={12}>
                        <img className="flower-image" src={tierImg[1]} />
                        <p>{tierLabel[getTierLevel(planet.rewardMult)]}</p>
                    </Col>
                    <Col className="center" md={12} xl={3} lg={6} xs={12}>
                        <div className="textContainer">
                            <div className="textRow">
                                <p className="card-title">TIER:</p>
                                <p className="card-value">2/10</p>
                            </div>
                            <div className="textRow">
                                <p className="card-title">COMPOUNDS:</p>
                                <p className="card-value">21/30</p>
                            </div>
                            <div className="textRow">
                                <p className="card-title">DAILY APR:</p>
                                <p className="card-value"> 1.2%</p>
                            </div>
                            <div className="textRow">
                                <p className="card-title">BOOSTER:</p>
                                <p className="card-value">Tier 3</p>
                            </div>
                            <div className="textRow">
                                <p className="card-title">CLAIMED:</p>
                                <p className="card-value">100 $pNCTR [100$]</p>
                            </div>
                        </div>
                    </Col>
                    <Col className="right" md={12} xl={3} lg={6} xs={12}>
                        <div className="textContainer">
                            <div className="textRow">
                                <p className="card-title">LOCKED:</p>
                                <p className="card-value">1000 $NCTR [$10]</p>
                            </div>

                            <div className="textRow">
                                <p className="card-title">DAILY:</p>
                                <p className="card-value">10 $NCTR [$10]</p>
                            </div>
                            <div className="textRow">
                                <p className="card-title">AUTO-CLAIM:</p>
                                <p className="card-value">00:32:21</p>
                            </div>

                            <div className="textRow">
                                <p className="card-title">AUTO-COMPOUND:</p>
                                <p className="card-value">24:28:25</p>
                            </div>
                            <div className="textRow">
                                <p className="card-value">PENDING:</p>
                                <p className="card-value">10 $NCTR [$10]</p>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="cardRow">
                    <Col className="left" md={12} xl={3} lg={6} xs={12}>
                        <>
                            <div className="flowerButtonWrapper">
                                <div className="nestedButton">
                                    <div className="flowerButtonContainer">
                                        <FlowerButton action="transfer" />
                                    </div>
                                    <div className="flowerButtonContainer">
                                        <FlowerButton action="rename" />
                                    </div>
                                </div>
                            </div>
                        </>
                    </Col>
                    <Col className="center" md={12} xl={3} lg={6} xs={12}>
                        <>
                            <div className="flowerButtonWrapper">
                                <div className="flowerButtonContainer">
                                    <FlowerButton action="add" />
                                </div>
                            </div>
                        </>
                    </Col>

                    <Col className="right" md={12} xl={3} lg={6} xs={12}>
                        <>
                            <div className="flowerButtonWrapper">
                                <div className="flowerButtonContainer">
                                    <FlowerButton action="claim" />
                                </div>
                            </div>
                        </>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default FlowerCard;
