import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() //pull out chainId obj and rename it as chainIdHex
    const chainId = parseInt(chainIdHex) //create new var called chainId
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const [interval, setInterval] = useState("0")
    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getPlayersNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const { runContractFunction: getInterval } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getInterval",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, entranceFee, numberOfPlayers, interval, recentWinner])

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getPlayersNumber()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        const intervalFromCall = (await getInterval()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
        setInterval(intervalFromCall)
    }

    function handleNewNotification() {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    // Probably could add some error handling
    async function handleSuccess(tx) {
        await tx.wait(1)
        updateUI()
        handleNewNotification(tx)
    }

    msgValue: return (
        <div className="p-5">
            {/* Hi from lottery entrance */}
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-green-200 hover:bg-green-500 flex-5 front-bold py-2 px-4 rounded-sm ml-auto w-64"
                        onClick={async function () {
                            await enterRaffle({
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isFetching || isLoading ? (
                            <div className="animate-spin spinner-border h-5 w-5  border-b-2 rounded-full  ..."></div>
                        ) : (
                            <div>Enter raffle</div>
                        )}
                    </button>
                    <div>
                        Chain ID :{" "}
                        <b>
                            {chainId} |{" "}
                            {(() => {
                                switch (chainId) {
                                    case 31337:
                                        return "Hardhat localhost"
                                    case 4:
                                        return "Rinkeby"
                                    default:
                                        return "Blockchain not compatible "
                                }
                            })()}
                        </b>
                    </div>
                    <div className="">
                        Entrance fee : <b>{ethers.utils.formatUnits(entranceFee, "ether")} ETH</b>
                    </div>
                    <div>
                        Number of players : <b>{numberOfPlayers}</b>
                    </div>
                    <div>
                        Time interval between each lottery draw : {""}
                        {}
                        <b>
                            {Math.floor(interval / 60 / 60) >= 1
                                ? Math.floor(interval / 60 / 60)`h`
                                : ""}{" "}
                            {Math.floor(interval / 60)}min {""}
                            {interval % 60 < 10 ? `0${interval % 60}` : interval % 60}sec
                        </b>
                    </div>
                    <div>
                        Recent winner : <b>{recentWinner}</b>
                    </div>
                </div>
            ) : (
                <div>No raffle adrress detected</div>
            )}
        </div>
    )
}
