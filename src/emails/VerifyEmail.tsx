import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface VerifyEmailProps {
    validationCode: string;
    appName: string;
    userName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL;

const copyright = (year: number) => {
    const currentYear = new Date().getFullYear();
    return year < currentYear ? `${year}-${year % 100}` : `${currentYear}`;
}

export const VerifyEmail = ({
    validationCode,
    appName,
    userName,
}: VerifyEmailProps) => (
    <Html>
        <Head />
        <Preview>Confirm your email address</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={logoContainer}>
                    <Img
                        src={`${baseUrl}/static/logo.png`}
                        width="120"
                        height="36"
                        alt="Slack"
                    />
                </Section>
                <Heading style={h1}>Confirm your email address</Heading>
                <Text style={heroText}>
                    Hello {userName}, <br />
                    Thanks for starting the new account creation process. We want to make sure it&apos;s really you. Please enter the following verification code when prompted. If you don&apos;t want to create an account, you can ignore this message.
                </Text>

                <Section style={codeBox}>
                    <Text style={confirmationCodeText}>{validationCode}</Text>
                </Section>

                <Text style={text}>
                    If you didn&apos;t request this email, there&apos;s nothing to worry about, you
                    can safely ignore it.
                </Text>

                <Section>
                    <Link
                        style={footerLink}
                        href={`${baseUrl}/policy`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Policies
                    </Link>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    <Link
                        style={footerLink}
                        href="https://theritiktiwari.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Website
                    </Link>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    <Link
                        style={footerLink}
                        href="https://linkedin.com/in/theritiktiwari"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </Link>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    <Link
                        style={footerLink}
                        href="https://github.com/theritiktiwari"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </Link>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    <Link
                        style={footerLink}
                        href="https://instagram.com/theritiktiwari"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Instagram
                    </Link>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    <Link
                        style={footerLink}
                        href="https://twitter.com/theritiktiwari"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Twitter
                    </Link>
                    <Text style={footerText}>
                        ©{copyright(2024)} {appName}. <br />
                        All rights reserved.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default VerifyEmail;

const footerText = {
    fontSize: "12px",
    color: "#b7b7b7",
    lineHeight: "15px",
    textAlign: "left" as const,
    marginBottom: "50px",
};

const footerLink = {
    color: "#b7b7b7",
    textDecoration: "underline",
};

const main = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
    margin: "0 auto",
    padding: "0px 20px",
};

const logoContainer = {
    marginTop: "32px",
};

const h1 = {
    color: "#1d1c1d",
    fontSize: "36px",
    fontWeight: "700",
    margin: "30px 0",
    padding: "0",
    lineHeight: "42px",
};

const heroText = {
    fontSize: "16px",
    lineHeight: "25px",
    marginBottom: "30px",
};

const codeBox = {
    background: "rgb(245, 244, 245)",
    borderRadius: "4px",
    marginBottom: "30px",
    padding: "40px 10px",
};

const confirmationCodeText = {
    fontSize: "30px",
    textAlign: "center" as const,
    verticalAlign: "middle",
};

const text = {
    color: "#000",
    fontSize: "14px",
    lineHeight: "24px",
};
