import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { ApeuContract, ApeuManagerContract, WalletObserverContract, USDCeContract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { RootState } from "../store";
import { BloomifyNFT } from "../../abi";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        avax: string;
        apeu: string;
        usdceBalance: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const avaxBalance = await provider.getSigner().getBalance();
    const avaxVal = ethers.utils.formatEther(avaxBalance);

    const natrContract = new ethers.Contract(addresses.NCTR_ADDRESS, ApeuContract, provider);

    // get natr balance
    const natrBalance = await natrContract.balanceOf(address);
    const natrVal = ethers.utils.formatUnits(natrBalance, "ether");

    const usdceContract = new ethers.Contract(addresses.USDCe_ADDRESS, USDCeContract, provider);

    const walletUsdceBalanc = await usdceContract.balanceOf(address);

    const walletUsdceBalance1 = walletUsdceBalanc.toNumber() / Math.pow(10, 6);

    const walletUsdceBalance = walletUsdceBalance1.toFixed(2);

    return {
        balances: {
            avax: avaxVal,
            apeu: natrVal,
            usdceBalance: walletUsdceBalance,
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IFlowerInfoDetails {
    id: number;
    name: string;
    creationTime: number;
    lastProcessingTimestamp: number;
    rewardMult: number;
    planetValue: number;
    totalClaimed: number;
    exists: boolean;
    pendingReward: number;
    rewardPerDay: number;
    compoundDelay: number;
    pendingRewardsGross: number;
    rewardPerDayGross: number;
    idnumber: number;
}

export interface IBloomBox {
    forestValue: number;
    nartValue: number;
    leafValue: number;
    leafToNart: number;
    claimed: number;
}

export interface INFTBalance {
    hasNft: boolean;
    nftTier: number;
    usdceBalance: number;
}

export interface IApprovals {
    approvedValue: number;
    isUsdcApproved: boolean;
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails) => {
    const addresses = getAddresses(networkID);

    const avaxBalance = await provider.getSigner().getBalance();
    const avaxVal = ethers.utils.formatEther(avaxBalance);

    const natrContract = new ethers.Contract(addresses.NCTR_ADDRESS, ApeuContract, provider);
    const natrManagerContract = new ethers.Contract(addresses.NATR_MANAGER_ADDRESS, ApeuManagerContract, provider);
    const walletObserverContract = new ethers.Contract(addresses.WALLET_OBSERVER_CONTRACT, WalletObserverContract, provider);

    const usdceContract = new ethers.Contract(addresses.USDCe_ADDRESS, USDCeContract, provider);

    const walletUsdceBalanc = await usdceContract.balanceOf(address);

    const walletUsdceBalance1 = walletUsdceBalanc.toNumber() / Math.pow(10, 6);

    const walletUsdceBalance = walletUsdceBalance1.toFixed(2);

    const needForApproval = 15792089237316195423570985008687907853269984665640564039457584007913129639935;

    const approvedValue = await usdceContract.allowance(address, addresses.BLOOM_NFT_ADDRESS);

    let isApproved = false;

    if (approvedValue > 0 && approvedValue == needForApproval) {
        isApproved = true;
    }

    // get natr balance
    const natrBalance = await natrContract.balanceOf(address);
    const natrVal = ethers.utils.formatUnits(natrBalance, "ether");

    //get natr allowance
    const natrAllowance = await natrContract.allowance(address, addresses.NATR_MANAGER_ADDRESS);
    const natrAll = ethers.utils.formatUnits(natrAllowance, "ether");

    //get planet data
    const planetIds = [1];
    //  const planetIds = await natrManagerContract.getPlanetIdsOf(address);

    const planetData = await natrManagerContract.getPlanetsByIds(planetIds);

    const planetCount = planetData.length;

    let planetInfoData = [];
    let estimatedPerDay = 0;
    let totalPendingReward = 0;

    for (let i = 0; i < planetCount; i++) {
        const planet: IFlowerInfoDetails = {
            id: Number(planetData[i][0][0]),
            name: String(planetData[i][0][1]),
            creationTime: Number(planetData[i][0][2]),
            lastProcessingTimestamp: Number(planetData[i][0][3]),
            rewardMult: Number(planetData[i][0][4]),
            planetValue: Number(planetData[i][0][5]) / Math.pow(10, 18),
            totalClaimed: Number(planetData[i][0][6]) / Math.pow(10, 18),
            exists: Boolean(planetData[i][0][7]),
            pendingReward: Number(planetData[i][2]) / Math.pow(10, 18),
            rewardPerDay: Number(planetData[i][3]) / Math.pow(10, 18),
            compoundDelay: Number(planetData[i][4]),
            pendingRewardsGross: Number(planetData[i][5]) / Math.pow(10, 18),
            rewardPerDayGross: Number(planetData[i][6]) / Math.pow(10, 18),

            idnumber: Number(i),
        };

        estimatedPerDay += Number(planetData[i][3]);
        totalPendingReward += Number(planetData[i][2]);

        planetInfoData[i] = planet;
    }

    const estimatedPerDayValue = estimatedPerDay / Math.pow(10, 18);
    const totalPendingRewardValue = totalPendingReward / Math.pow(10, 18);

    //get limits data
    let [, , , remainingTransfersIn, remainingTransferOut, remainingSellOut] = await walletObserverContract.getOverviewOf(address);
    remainingTransfersIn = ethers.utils.formatUnits(remainingTransfersIn, "ether");
    remainingTransferOut = ethers.utils.formatUnits(remainingTransferOut, "ether");
    remainingSellOut = ethers.utils.formatUnits(remainingSellOut, "ether");

    // GET BLOOM NFT DATA :
    let tier = 0;
    let haveNft = false;
    const bloomNftContract = new ethers.Contract(addresses.BLOOM_NFT_ADDRESS, BloomifyNFT, provider);

    for (let i = 1; i < 11; i++) {
        let positive = 0;
        positive = await bloomNftContract.balanceOf(address, i);

        if (positive > 0) {
            tier = i;
            haveNft = true;
            break;
        }
    }

    return {
        balances: {
            avax: avaxVal,
            apeu: natrVal,
            allowance: natrAll,
            usdceBalance: walletUsdceBalance,
        },
        limits: {
            transferIn: remainingTransfersIn,
            transferOut: remainingTransferOut,
            sellOut: remainingSellOut,
        },
        planets: planetInfoData,
        number: planetCount,
        estimated: estimatedPerDayValue,
        totalpending: totalPendingRewardValue,
        nftBalances: {
            hasNft: haveNft,
            nftTier: tier,
            usdceBalance: walletUsdceBalance,
        },
        approvals: {
            approvedValue: approvedValue,
            isUsdcApproved: isApproved,
        },
    };
});

const initialState = {
    loading: true,
};

export interface IAccountSlice {
    loading: boolean;
    balances: {
        avax: string;
        apeu: string;
        allowance: string;
        usdceBalance: number;
    };
    limits: {
        transferIn: string;
        transferOut: string;
        sellOut: string;
    };
    planets: IFlowerInfoDetails[];
    number: number;
    estimated: number;
    totalpending: number;
    nftBalances: {
        hasNft: boolean;
        nftTier: number;
        usdceBalance: number;
    };
    approvals: {
        approvedValue: number;
        isUsdcApproved: boolean;
    };
}

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
