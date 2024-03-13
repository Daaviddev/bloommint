import { useSelector } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";
import { IAccountSlice } from "../../store/slices/account-slice";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import "./bloomify.scss";
import BloomButton from "./components/bloomButton";
import { Form, Field } from "react-final-form";
import t1 from "../../assets/bloomNFT/1.png";
import t2 from "../../assets/bloomNFT/2.png";
import t3 from "../../assets/bloomNFT/3.png";
import t4 from "../../assets/bloomNFT/4.png";
import t5 from "../../assets/bloomNFT/5.png";
import t6 from "../../assets/bloomNFT/6.png";
import CreatableSelect from "react-select/creatable";
import { useState } from "react";

const tierImg = [t1, t2, t3, t4, t5, t6];
const roles = [
    { value: "abac", label: "Jeremy" },
    { value: "0x000", label: "Pelton" },
    { value: "0x000", label: "Marketing" },
];

const customStyle = {};

function Bloomify() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);
    const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);
    const account = useSelector<IReduxState, IAccountSlice>(state => state.account);
    const [roleValue, setRoleValue] = useState<string>("");

    const [quantity, setQuantity] = useState<string>("");
    const [name, setName] = useState<string>("");

    const value = "";
    const field = "";

    const handleChange = (field: any, value: any) => {
        switch (field) {
            case "roles":
                setRoleValue(value);
                setName(value.value);
                console.log("123" + value.value);
                break;

            default:
                break;
        }
    };

    const handleClick = () => {
        const abc = roleValue;
        console.log("123" + abc);
        return "";
    };

    return (
        <>
            <Container className="bloomify dontshow">
                <Row className="infoRow row2">
                    <Col className="infoCol col2" md={12} xl={3} lg={6} xs={12}>
                        <Card className="nodetiercontanern card2">
                            <CardBody className="infoCardBody cardBody3">
                                <div className="contentWrapper contentWrapper3">
                                    <div className="headerWrapper">
                                        <span className="headerText">Available ($NCTR)</span>
                                    </div>
                                    <div className="subheadContainer">
                                        <span className="subheadText">1 $NCTR = 0.00 USDC.e</span>
                                    </div>
                                    <div className="valueWrapper">
                                        <div className="availableRewardContainer">
                                            <p className="dollarAvailable">
                                                {isAppLoading ? (
                                                    <Skeleton width="100px" />
                                                ) : (
                                                    `$${new Intl.NumberFormat("en-US").format(Math.floor((account.totalpending * app.mimPrice * app.marketPrice) / 10000))}`
                                                )}
                                            </p>
                                            <p className="headerText">{isAccountLoading ? <Skeleton width="100px" /> : `1000 NCTR`}</p>
                                        </div>
                                    </div>
                                    <div className="buttonWrapper">
                                        {" "}
                                        <div className="buttonContainer">
                                            <BloomButton action="claim" />
                                        </div>
                                        <div className="buttonContainer">
                                            <BloomButton action="compound" />
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="infoCol col2" md={12} xl={3} lg={6} xs={12}>
                        <Card className="nodetiercontanern card2">
                            <CardBody className="infoCardBody cardBody3">
                                <div className="contentWrapper contentWrapper3">
                                    <div>
                                        <div className="headerWrapper">
                                            <span className="headerText">Deposit</span>
                                        </div>
                                    </div>
                                    <div className="depositWrapper">
                                        <div className="labelWrapper">
                                            <label className="depositLabel subheadText">VALUE </label>
                                            <label className="depositLabel subheadText">USDC.e : </label>
                                        </div>
                                        <input type="number" className="depositInput" value={quantity} onChange={e => setQuantity(e.target.value)} />
                                    </div>
                                    <div className="depositWrapper">
                                        <div className="labelWrapper">
                                            <label className="depositLabel subheadText">COMPANION </label>{" "}
                                        </div>
                                        <CreatableSelect isClearable onChange={value => handleChange("roles", value)} options={roles} value={roleValue} />
                                    </div>{" "}
                                    <div className="buttonWrapper">
                                        <div className="buttonContainer" onClick={handleClick}>
                                            <BloomButton action="deposit" />
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="infoCol col2" md={12} xl={3} lg={6} xs={12}>
                        <Card className="nodetiercontanern card2">
                            <CardBody className="infoCardBody cardBody3">
                                <div className="contentWrapper contentWrapper3">
                                    <div className="headerWrapper">
                                        <span className="headerText">Check Out Bloomer</span>
                                    </div>
                                    <div className="depositWrapper">
                                        <div className="labelWrapper">
                                            <label className="depositLabel subheadText">BLOOMER: </label>
                                        </div>
                                        <input type="text" className="depositInput" />
                                    </div>
                                    <div className="tableWrapper">
                                        <div className="rowWrapper">
                                            <p className="subheadText">Team</p>
                                            <p className="subheadText">0</p>
                                        </div>
                                        <div className="rowWrapper">
                                            <p className="subheadText">Airdrops Sent </p>
                                            <p className="subheadText">0 $NCTR</p>
                                        </div>
                                    </div>
                                    <div className="buttonWrapper">
                                        <div className="buttonContainer">
                                            <BloomButton action="check" />
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className="infoRow row3">
                    <Col className="infoCol1 col3" md={12} xl={4} lg={5} xs={12}>
                        <Card className="infoCard1 card3">
                            <CardBody className="infoCardBody1 cardBody3">
                                <div className="contentWrapper contentWrapper3">
                                    <div>
                                        <div className="headerWrapper1">
                                            <span className="headerText">Your Info</span>
                                        </div>
                                    </div>
                                    <div className="tableWrapper">
                                        <div className="rowWrapper">
                                            <p className="subheadText">Deposited</p>
                                            <p className="subheadText">0 $NCTR</p>
                                        </div>
                                        <div className="rowWrapper">
                                            <p className="subheadText">Referral Rewards</p>
                                            <p className="subheadText">0 $NCTR</p>
                                        </div>
                                        <div className="rowWrapper">
                                            <p className="subheadText"> Max Payout </p>
                                            <div>
                                                <p className="subheadText">0 $NCTR</p>
                                            </div>
                                        </div>
                                        <div className="rowWrapper">
                                            <p className="subheadText">Claimed </p>
                                            <p className="subheadText">0 $NCTR</p>
                                        </div>
                                        <div className="rowWrapper">
                                            <p className="subheadText">Team </p>
                                            <p className="subheadText">0</p>
                                        </div>
                                    </div>
                                    <div className="buttonWrapper">
                                        <div className="buttonContainer">
                                            <BloomButton action="upgrade" />
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="infoCol1 col3 col21" md={12} xl={8} lg={7} xs={12}>
                        <Card className="infoCard1 card3">
                            <CardBody className="infoCardBody1 cardBody3">
                                <div className="contentWrapper contentWrapper3">
                                    <img className="fly-image" src={tierImg[5]} />
                                    <div className="tableWrapper">
                                        <div className="rowWrapper">
                                            <p className="subheadText">Tier</p>
                                            <p className="subheadText">1</p>
                                        </div>
                                        <div className="rowWrapper">
                                            <p className="subheadText">Downlines Accessible </p>
                                            <p className="subheadText">1/15</p>
                                        </div>
                                        <div className="rowWrapper">
                                            <p className="subheadText">Downlines Available</p>
                                            <p className="subheadText">0/15</p>
                                        </div>
                                    </div>
                                    <div className="buttonWrapper">
                                        <div className="buttonContainer">
                                            <BloomButton action="upgrade" />
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Bloomify;
