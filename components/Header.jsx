import { ConnectButton } from "web3uikit"
export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-2 px-9 front-blog text-3xl">Decentralize lottery</h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton />
            </div>
        </div>
    )
}
