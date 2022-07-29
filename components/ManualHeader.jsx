import { useMoralis } from "react-moralis"
import { useEffect } from "react"

//rfc
export default function ManualHeader() {
    const { enableWeb3, deactivateWeb3, isWeb3Enabled, isWeb3EnableLoading, account, Moralis } =
        useMoralis()

    useEffect(() => {
        if (
            !isWeb3Enabled &&
            typeof window !== "undefined" &&
            window.localStorage.getItem("connected")
        ) {
            enableWeb3()
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null Account found")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <button className="button" disabled={isWeb3Enabled}>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 2)}
                </button>
            ) : (
                <button
                    className="button"
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined")
                            window.localStorage.setItem("connected", "injected")
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}