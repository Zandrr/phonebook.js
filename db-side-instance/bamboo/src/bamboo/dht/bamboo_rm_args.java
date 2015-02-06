/*
 * Automatically generated by jrpcgen 1.0.5 on 2/6/15 9:48 AM
 * jrpcgen is part of the "Remote Tea" ONC/RPC package for Java
 * See http://acplt.org/ks/remotetea.html for details
 */
package bamboo.dht;
import org.acplt.oncrpc.*;
import java.io.IOException;

public class bamboo_rm_args implements XdrAble {
    public String application;
    public String client_library;
    public bamboo_key key;
    public bamboo_value_hash value_hash;
    public int ttl_sec;

    public bamboo_rm_args() {
    }

    public bamboo_rm_args(XdrDecodingStream xdr)
           throws OncRpcException, IOException {
        xdrDecode(xdr);
    }

    public void xdrEncode(XdrEncodingStream xdr)
           throws OncRpcException, IOException {
        xdr.xdrEncodeString(application);
        xdr.xdrEncodeString(client_library);
        key.xdrEncode(xdr);
        value_hash.xdrEncode(xdr);
        xdr.xdrEncodeInt(ttl_sec);
    }

    public void xdrDecode(XdrDecodingStream xdr)
           throws OncRpcException, IOException {
        application = xdr.xdrDecodeString();
        client_library = xdr.xdrDecodeString();
        key = new bamboo_key(xdr);
        value_hash = new bamboo_value_hash(xdr);
        ttl_sec = xdr.xdrDecodeInt();
    }

}
// End of bamboo_rm_args.java
