import { useWeb3 } from '../context/Web3Context';
import { formatAddress } from '../utils/contractHelpers';

export default function WalletConnect() {
  const { account, network, isConnecting, error, connectWallet, disconnectWallet, isConnected } = useWeb3();

  return (
    <div className="wallet-connect">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="connect-button"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="wallet-info">
          <div className="account-info">
            <span className="account-address">{formatAddress(account)}</span>
            {network && <span className="network-badge">{network.name}</span>}
          </div>
          <button onClick={disconnectWallet} className="disconnect-button">
            Disconnect
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}
