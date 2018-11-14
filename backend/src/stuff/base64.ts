export class Base64 {
  public static encode(unencoded: string) {
    return new Buffer(unencoded || "").toString("base64");
  }

  public static decode(encoded: string) {
    return new Buffer(encoded || "", "base64").toString("utf8");
  }

  public static urlEncode(unencoded: string) {
    const encoded = this.encode(unencoded);
    return encoded
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  public static urlDecode(encoded: string) {
    encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (encoded.length % 4) encoded += "=";
    return this.decode(encoded);
  }
}
