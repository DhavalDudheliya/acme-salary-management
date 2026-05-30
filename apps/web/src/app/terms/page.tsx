import { Metadata } from "next";
import React from "react";
import { LegalPageLayout } from "@/components/shared/legal-page-layout";

export const metadata: Metadata = {
  title: "Terms of Service | SupportHub",
  description:
    "Read the SupportHub Terms of Service to understand account creation, usage conditions, billing rules, and legal liabilities.",
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <>
        <p>
          By creating a workspace, registering an account, or using the
          SupportHub application, services, and website (collectively, the
          &quot;Services&quot;), you agree to be bound by these Terms of Service
          (&quot;Terms&quot;).
        </p>
        <p>
          These Terms constitute a legally binding agreement between your
          organization or you individually (referred to as &quot;Customer,&quot;
          &quot;you,&quot; or &quot;your&quot;) and SupportHub Inc. If you are
          entering into this agreement on behalf of a company or other legal
          entity, you represent that you have the authority to bind such entity
          to these Terms. If you do not agree with any part of these Terms, you
          must not access or use our Services.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "2. Account Registration & Workspace Creation",
    content: (
      <>
        <p>
          To access the platform, you must create a customer support tenant
          workspace and register at least one administrator account. You agree
          to:
        </p>
        <ul className="list-disc pl-5 space-y-2 my-4">
          <li>
            Provide accurate, complete, and current registration information.
          </li>
          <li>
            Keep your login credentials (username, password, and session tokens)
            secure and confidential.
          </li>
          <li>
            Be solely responsible for all activities, actions, and ticket
            creations that occur under your workspace or by your registered
            agents.
          </li>
          <li>
            Notify us immediately of any unauthorized access, breach of
            security, or compromise of credentials.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "services",
    title: "3. Services and Support SLA",
    content: (
      <>
        <p>
          SupportHub provides ticket creation, customer profile management,
          email parsing, third-party integrations, and support automation
          services.
        </p>
        <p>
          While we strive to provide high availability (targeting a 99.9% uptime
          SLA for paid tiers), we do not guarantee that the Services will be
          uninterrupted, bug-free, or completely secure. We reserve the right to
          temporarily suspend the Services for scheduled maintenance, security
          updates, or emergency repairs, and will make reasonable efforts to
          notify you in advance.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use Policy",
    content: (
      <>
        <p>
          You agree not to use the Services to, or permit any agent or customer
          to:
        </p>
        <ul className="list-disc pl-5 space-y-2 my-4">
          <li>
            Transmit spam, unauthorized mass communications, or phishing emails.
          </li>
          <li>
            Upload or attach malware, viruses, or harmful software scripts
            inside support tickets.
          </li>
          <li>
            Scrape, crawl, or run penetration tests on SupportHub infrastructure
            without prior written authorization.
          </li>
          <li>
            Interfere with or disrupt the integrity or performance of the
            platform.
          </li>
          <li>
            Violate any local, state, federal, or international laws or
            regulations, including those governing data privacy and encryption.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "billing",
    title: "5. Billing, Payments & Cancellations",
    content: (
      <>
        <p className="font-semibold text-white mt-4 mb-2">
          A. Subscriptions and Fees
        </p>
        <p>
          Access to certain premium features of the platform is billed on a
          subscription basis (monthly or annually). Fees are calculated based on
          selected plan criteria, such as the number of active support agents or
          volume of tickets.
        </p>
        <p className="font-semibold text-white mt-4 mb-2">
          B. Auto-Renewal & Payment
        </p>
        <p>
          Subscriptions automatically renew at the end of each billing cycle
          unless cancelled beforehand. You authorize us to charge your
          registered payment card for the renewal fee using our third-party
          payment processor (Stripe).
        </p>
        <p className="font-semibold text-white mt-4 mb-2">
          C. Cancellation & Refunds
        </p>
        <p>
          You can cancel your subscription plan at any time through your
          workspace settings. Upon cancellation, you will retain access to
          premium features until the end of the current billing cycle. All paid
          fees are non-refundable unless required by applicable law or
          explicitly stated otherwise.
        </p>
      </>
    ),
  },
  {
    id: "ip",
    title: "6. Intellectual Property Rights",
    content: (
      <>
        <p className="font-semibold text-white mt-4 mb-2">
          A. SupportHub Ownership
        </p>
        <p>
          SupportHub retains all rights, titles, and interests in the Services,
          including all software code, visual UI elements, design systems,
          algorithms, documentation, logos, and trademarks. You may not copy,
          reverse-engineer, or adapt any part of our code or design without
          express written consent.
        </p>
        <p className="font-semibold text-white mt-4 mb-2">
          B. Customer Data & Content
        </p>
        <p>
          You retain full ownership of all data, support ticket text, media
          files, and communication contents uploaded to your workspace
          (collectively, &quot;Customer Data&quot;). You grant SupportHub a
          limited, non-exclusive license to process and store Customer Data
          solely for the purpose of providing, hosting, and improving the
          Services.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: (
      <>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, SUPPORTHUB INC. AND ITS
          SUPPLIERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE,
          DATA, OR USE, INCURRED BY YOU OR ANY THIRD PARTY, WHETHER IN AN ACTION
          IN CONTRACT OR TORT, ARISING FROM YOUR ACCESS TO, OR USE OF, THE
          SERVICES.
        </p>
        <p>
          OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING UNDER THESE TERMS
          OR OUT OF THE USE OF THE SERVICES SHALL NOT EXCEED THE TOTAL FEES PAID
          BY YOU TO SUPPORTHUB IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "8. Termination of Accounts",
    content: (
      <>
        <p>
          We reserve the right to suspend or terminate your workspace access
          immediately, without prior notice or liability, if you breach any of
          these Terms, engage in fraudulent activities, or fail to pay
          subscription balances when due.
        </p>
        <p>
          Upon termination, your right to access and use the Services ceases.
          You may download your workspace data before termination, or request a
          complete purge of your records in compliance with our Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "9. Governing Law & Dispute Resolution",
    content: (
      <>
        <p>
          These Terms and any dispute arising from them shall be governed by,
          and construed in accordance with, the laws of the State of California,
          United States, without regard to conflict of law principles.
        </p>
        <p>
          Any legal action, suit, or proceeding arising out of or related to
          these Terms shall be instituted exclusively in the federal or state
          courts located in San Francisco County, California, and you consent to
          the jurisdiction of such courts.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to Terms",
    content: (
      <>
        <p>
          We reserve the right to revise or replace these Terms at any time. If
          a revision is material, we will provide at least 30 days&apos; notice
          prior to any new terms taking effect by posting an announcement in the
          administrator dashboard or sending an email notification to workspace
          owners.
        </p>
        <p>
          By continuing to access or use our Services after those revisions
          become effective, you agree to be bound by the revised terms.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="Please review our terms of service carefully. They govern your use of the SupportHub workspace, ticketing engines, and dashboard."
      lastUpdated="May 30, 2026"
      sections={sections}
    />
  );
}
