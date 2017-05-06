import * as SimplePeer from "simple-peer";

export type SignalData = SimplePeer.SignalData;

class Connection
{
  constructor(config : SimplePeer.Options, onSignal : (data : SimplePeer.SignalData) => void)
  {
    this.peer = SimplePeer(config);
    this.peer.on('signal', (data : SimplePeer.SignalData) => { onSignal(data); });
  }

  onConnect(callback : () => void) : void
  {
    this.peer.on('connect', callback);
  }

  send(data : any) : void
  {
    this.peer.send(JSON.stringify(data));
  }

  onData(callback : (data : any) => void) : void
  {
    this.peer.on('data', (data : string | Buffer) =>
    {
      if (typeof data === "string")
      {
        callback(JSON.parse(data));
      }
      else
      {
        callback(JSON.parse(data.toString()));
      }
    });
  }

  destroy() : void
  {
    this.peer.destroy();
    this.peer = null;
  }

  protected peer : SimplePeer.Instance = null;
  protected static readonly DefaultConfig : SimplePeer.Options = {
    trickle : false,
    channelConfig : {
      ordered : false,
      maxRetransmits : 0
    }
  };
};

export class Server extends Connection
{
  constructor(onSignal : (data : SignalData) => void)
  {
    super(Object.assign({ initiator : true }, Connection.DefaultConfig), onSignal);
  }

  acceptConnection(data : SignalData) : void
  {
    this.peer.signal(data);
  }
};

export class Client extends Connection
{
  constructor(offer : SignalData, onSignal : (data : SignalData) => void)
  {
    super(Connection.DefaultConfig, onSignal);
    this.peer.signal(offer);
  }
};