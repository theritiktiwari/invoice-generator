import {
    Body,
    Column,
    Font,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

const format = (amount: number, curr: string) => {
    const label = "en-" + curr.substring(0, 2).toUpperCase();

    const formatter = new Intl.NumberFormat(label, {
        style: 'currency',
        currency: curr,
    });

    return formatter.format(amount);
}

export const InvoiceEmail = ({ data }: { data: any }) => (
    <Html>
        <Head>
            <Font
                fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                    url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                    format: "woff2",
                }}
                fontWeight={300}
                fontStyle="light"
            />
        </Head>
        <Body style={main}>
            <Preview>Check your invoice now.</Preview>
            <div style={{ width: "95%", margin: "0 auto" }}>
                <Section>
                    <Row style={{
                        margin: "1rem 0",
                        width: "100%",
                    }}>
                        <Column style={{ width: "50%" }}>
                            <Img
                                src={data?.businessLogo}
                                alt={data?.businessName}
                                width={50}
                                height={50}
                            />
                        </Column>
                        <Column style={{ textAlign: "right" }}>
                            <Text><span style={{ fontWeight: 700 }}>{"Date: "}</span> {data?.invoiceDate}</Text>
                        </Column>
                    </Row>
                </Section>

                <Section style={{
                    textAlign: "center",
                }}>
                    <Heading as="h1" style={h1}>Invoice</Heading>
                    <Text style={{
                        fontSize: "1.125rem",
                    }}>{`No. ${data?.invoiceNumber}`}</Text>
                </Section>

                <Section>
                    <div style={{
                        margin: "2rem 0",
                        width: "100%",
                        display: "table",
                    }}>
                        <div style={{ display: "table-cell", width: "50%", verticalAlign: "top" }}>
                            <Heading as="h3" style={{ ...noGap, fontSize: "1.25rem", fontWeight: 700 }}>Billed To:</Heading>
                            <Text style={{ ...noGap, fontWeight: 500 }}>{data?.customerName}</Text>
                            <Text style={noGap}>{data?.billingAddress?.address1}</Text>
                            <Text style={noGap}>{data?.billingAddress?.address2}</Text>
                            <Text style={noGap}>{`
                                ${data?.billingAddress?.city}, 
                                ${data?.billingAddress?.state}, 
                                ${data?.billingAddress?.pincode}
                            `}</Text>
                        </div>

                        <div style={{ display: "table-cell", width: "50%", verticalAlign: "top" }}>
                            <Heading as="h3" style={{ ...noGap, fontSize: "1.25rem", fontWeight: 700 }}>From:</Heading>
                            <Text style={{ ...noGap, fontWeight: 500 }}>{data?.businessName}</Text>
                            <Text style={noGap}>{data?.businessAddress?.address1}</Text>
                            <Text style={noGap}>{data?.businessAddress?.address2}</Text>
                            <Text style={noGap}>{`
                                ${data?.businessAddress?.city}, 
                                ${data?.businessAddress?.state}, 
                                ${data?.businessAddress?.pincode}
                            `}</Text>
                        </div>
                    </div>
                </Section>

                <Section>
                    <table style={{ width: "100%" }}>
                        <thead style={{ backgroundColor: bgColor }}>
                            <tr>
                                <th style={{ ...tableCell, ...tableHead, color: invoiceColor, textAlign: "left", paddingLeft: "10px" }}>Item</th>
                                <th style={{ ...tableCell, ...tableHead, color: invoiceColor }}>Quantity</th>
                                <th style={{ ...tableCell, ...tableHead, color: invoiceColor }}>Price</th>
                                <th style={{ ...tableCell, ...tableHead, color: invoiceColor, textAlign: "right", paddingRight: "10px" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.productDetails.map((item: { name: string; quantity: number; price: number; }) => (
                                <tr key={data?.productDetails.indexOf(item)}>
                                    <td style={{ ...tableCell, borderBottom: "1px solid #DDD", textAlign: "left", paddingLeft: "10px" }}>{item.name}</td>
                                    <td style={{ ...tableCell, borderBottom: "1px solid #DDD" }}>{item.quantity < 10 ? `0${item.quantity}` : item.quantity}</td>
                                    <td style={{ ...tableCell, borderBottom: "1px solid #DDD" }}>{format(item.price, data?.currency)}</td>
                                    <td style={{ ...tableCell, borderBottom: "1px solid #DDD", textAlign: "right", paddingRight: "10px" }}>{format(item.quantity * item.price, data?.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot style={{ backgroundColor: bgColor, height: "30px" }}>
                            <tr>
                                <td style={{ ...tableHead, color: invoiceColor, textAlign: "left", paddingLeft: "10px" }} colSpan={3}>Total Amount</td>
                                <td style={{ ...tableHead, color: invoiceColor, textAlign: "right", paddingRight: "10px" }}>{format(data?.totalAmount, data?.currency)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </Section>

                <Section>
                    <div style={{
                        margin: "2rem 0",
                        width: "100%",
                        display: "table",
                    }}>
                        <div style={{ display: "table-cell", width: "50%", verticalAlign: "bottom" }}>
                            <Text style={noGap}><span style={{ fontWeight: 700 }}>{`Name: `}</span> {data?.businessName}</Text>
                            {data?.businessGST && <Text style={noGap}><span style={{ fontWeight: 700 }}>{`GSTIN: `}</span> {data?.businessGST}</Text>}
                            {data?.businessPAN && <Text style={noGap}><span style={{ fontWeight: 700 }}>{`PAN: `}</span> {data?.businessPAN}</Text>}
                            {data?.paymentDetails?.bankName && <Text style={noGap}><span style={{ fontWeight: 700 }}>{`Bank Name: `}</span> {data?.paymentDetails?.bankName}</Text>}
                            {data?.paymentDetails?.ifscCode && <Text style={noGap}><span style={{ fontWeight: 700 }}>{`IFSC: `}</span> {data?.paymentDetails?.ifscCode}</Text>}
                            {data?.paymentDetails?.accountNumber && <Text style={noGap}><span style={{ fontWeight: 700 }}>{`Account Number: `}</span> {data?.paymentDetails?.accountNumber}</Text>}
                            {data?.paymentDetails?.upiId && <Text style={noGap}><span style={{ fontWeight: 700 }}>{`UPI ID: `}</span> {data?.paymentDetails?.upiId}</Text>}
                            <br />
                            <Text style={noGap}><span style={{ fontWeight: 700 }}>{`Payment Method: `}</span>
                                {data?.paymentMode === "NET_BANKING" ? "Net Banking" :
                                    data?.paymentMode === "COD" ? "Cash On Delivery" :
                                        data?.paymentMode}
                            </Text>
                        </div>

                        <div style={{ display: "table-cell", width: "50%", verticalAlign: "bottom", textAlign: "center" }}>
                            <Img
                                src={data?.businessSignature}
                                alt={data?.businessName}
                                width={150}
                                style={{ margin: "0 auto" }}
                            />
                            <Text style={{ ...noGap, fontWeight: 700 }}>Authorized Signatory</Text>
                        </div>
                    </div>
                </Section>

                <Section style={{
                    textAlign: "center",
                }}>
                    <Text>Thank you for choosing us!</Text>
                    <Row style={{ width: "100%" }}>
                        <Column style={{ width: "50%", textAlign: "left" }}>
                            {data?.businessWebsite && <a
                                style={{ color: primaryColor, textDecoration: "none" }}
                                href={`https://${data?.businessWebsite}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {data?.businessWebsite}
                            </a>}
                        </Column>

                        <Column style={{ width: "50%", textAlign: "right" }}>
                            {data?.businessEmail && <Link
                                style={{ color: primaryColor, textDecoration: "none" }}
                                href={`mailto:${data?.businessEmail}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {data?.businessEmail}
                            </Link>}
                        </Column>
                    </Row>

                    <Text>This invoice is generated by {" "}
                        <Link
                            style={{ color: primaryColor, textDecoration: "underline", fontWeight: "700" }}
                            href={process.env.NEXTAUTH_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {process.env.NEXT_PUBLIC_APP_NAME}
                        </Link>.
                    </Text>

                </Section>

            </div>
        </Body>
    </Html>
);

export default InvoiceEmail;

const primaryColor = "hsl(221.2 83.2% 53.3%)";
const invoiceColor = "hsl(205, 86%, 23%)";
const bgColor = "hsl(196, 54%, 88%)";

const main = {
    width: "100%",
    backgroundColor: "#FFF",
    margin: "0 auto",
    fontFamily: "'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const h1 = {
    color: invoiceColor,
    fontSize: "3rem",
    lineHeight: "1",
    fontWeight: "800",
    marginBottom: "0 !important",
    paddingBottom: "0 !important",
};

const noGap = {
    margin: "0 !important",
    padding: "0 !important",
};

const tableCell = {
    textAlign: "center" as const,
    height: "50px",
}

const tableHead = {
    fontWeight: 700,
    fontSize: "1.125rem",
    lineHeight: "1.75rem",
    height: "50px",
}