/*
 * Automatically generated by jrpcgen 1.0.5 on 2/6/15 9:48 AM
 * jrpcgen is part of the "Remote Tea" ONC/RPC package for Java
 * See http://acplt.org/ks/remotetea.html for details
 */
package bamboo.dht;
import org.acplt.oncrpc.*;
import java.io.IOException;

public class bamboo_placemark implements XdrAble {

    public byte [] value;

    public bamboo_placemark() {
    }

    public bamboo_placemark(byte [] value) {
        this.value = value;
    }

    public bamboo_placemark(XdrDecodingStream xdr)
           throws OncRpcException, IOException {
        xdrDecode(xdr);
    }

    public void xdrEncode(XdrEncodingStream xdr)
           throws OncRpcException, IOException {
        xdr.xdrEncodeDynamicOpaque(value);
    }

    public void xdrDecode(XdrDecodingStream xdr)
           throws OncRpcException, IOException {
        value = xdr.xdrDecodeDynamicOpaque();
    }

}
// End of bamboo_placemark.java
