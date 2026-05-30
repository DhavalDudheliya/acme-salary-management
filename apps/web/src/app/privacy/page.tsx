import { Metadata } from "next";
import React from "react";
import { LegalPageLayout } from "@/components/shared/legal-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | SupportHub",
  description:
    "Learn how SupportHub collects, uses, and protects your organization's and customer support data.",
};

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p>
          Welcome to SupportHub (referred to as &quot;we,&quot; &quot;our,&quot;
          or &quot;us&quot;). We are committed to protecting your privacy and
          ensuring the security of your organization&apos;s data, customer
          communications, and tickets.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you use our multi-tenant workspace
          platform, connect external integrations (such as Google/Outlook), or
          visit our website. By accessing or using SupportHub, you agree to the
          collection and use of information in accordance with this policy.
        </p>
      </>
    ),
  },
  {
    id: "data-collection",
    title: "2. Information We Collect",
    content: (
      <>
        <p className="font-semibold text-white mt-4 mb-2">
          A. User Account Details
        </p>
        <p>
          When you register for an account, set up a tenant workspace, or join a
          support team, we collect your name, email address, password hash,
          role, and organization name.
        </p>
        <p className="font-semibold text-white mt-4 mb-2">
          B. Inbound Email Data
        </p>
        <p>
          SupportHub automatically processes inbound emails sent to configured
          support addresses (e.g., support@yourtenant.supporthub.io) to generate
          and manage support tickets. This processing reads the email headers,
          sender details, subject, body, and attachments.
        </p>
        <p className="font-semibold text-white mt-4 mb-2">
          C. Third-Party Integrations
        </p>
        <p>
          If you link your workspace to external email providers like Gmail or
          Microsoft Outlook, we collect OAuth tokens to authenticate and sync
          inbox messages. We only access and store the message payloads
          necessary to create and manage support tickets.
        </p>
        <p className="font-semibold text-white mt-4 mb-2">
          D. Usage & Device Information
        </p>
        <p>
          We automatically collect logs regarding interaction with our
          dashboard, including IP addresses, browser types, operating systems,
          page views, and timestamps.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    content: (
      <>
        <p>
          We use the collected information for various business purposes,
          including:
        </p>
        <ul className="list-disc pl-5 space-y-2 my-4">
          <li>
            Providing, operating, and maintaining the SupportHub platform.
          </li>
          <li>
            Converting your inbound emails into support tickets and organizing
            them within workspaces.
          </li>
          <li>
            Running ticket automation systems, such as automated tagging, SLA
            triggers, and agent assignments.
          </li>
          <li>Processing billing and payments for subscription plans.</li>
          <li>
            Sending security alerts, system updates, and support-related
            notices.
          </li>
          <li>
            Analyzing application performance to fix bugs and improve usability.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. Information Sharing & Disclosure",
    content: (
      <>
        <p>
          We do not sell, rent, or trade your support ticket contents or user
          data to third parties for marketing purposes. We share information
          only under the following conditions:
        </p>
        <ul className="list-disc pl-5 space-y-2 my-4">
          <li>
            <strong className="text-white">
              With Trusted Service Providers:
            </strong>{" "}
            We share data with hosting platforms (e.g., Vercel, AWS), databases,
            analytics services, and email dispatch tools who perform operations
            on our behalf and are bound by confidentiality.
          </li>
          <li>
            <strong className="text-white">For Legal Compliance:</strong> We may
            disclose information if required to do so by law, court order, or
            governmental authorities to comply with safety and legal
            obligations.
          </li>
          <li>
            <strong className="text-white">Business Transfers:</strong> In the
            event of a merger, acquisition, or sale of assets, your organization
            data may be transferred, subject to terms consistent with this
            Privacy Policy.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "5. Data Security",
    content: (
      <>
        <p>
          The security of your data is paramount. SupportHub implements
          industry-standard technical and organizational security measures:
        </p>
        <ul className="list-disc pl-5 space-y-2 my-4">
          <li>
            All network traffic is encrypted in transit using SSL/TLS protocols.
          </li>
          <li>
            Database volumes and sensitive tokens (such as integration
            credentials) are encrypted at rest.
          </li>
          <li>
            We implement strict access controls ensuring tenant workspaces are
            completely isolated from one another.
          </li>
          <li>
            Periodic vulnerability scanning and codebase dependencies are
            audited regularly.
          </li>
        </ul>
        <p className="mt-4">
          Please note that no method of transmission over the Internet, or
          method of electronic storage, is 100% secure. While we strive to use
          commercially acceptable means to protect your personal data, we cannot
          guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "6. Data Retention & Deletion",
    content: (
      <>
        <p>
          We retain your personal data and customer support tickets for as long
          as your tenant workspace account is active or as needed to provide
          services.
        </p>
        <p>
          Organization administrators can delete workspaces, which will remove
          ticket histories, attachments, integration credentials, and agent
          accounts from our active database systems. Archive backups are held
          for a maximum of 30 days before being completely purged.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "7. Your Rights & Options",
    content: (
      <>
        <p>
          Depending on your location, you may have rights under the GDPR, CCPA,
          or other regional regulations. These rights include:
        </p>
        <ul className="list-disc pl-5 space-y-2 my-4">
          <li>Accessing, updating, or correcting your account details.</li>
          <li>
            Downloading a portable copy of your ticket and workspace data.
          </li>
          <li>
            Revoking API access permissions for Google Gmail or Microsoft
            Outlook integrations at any time directly through your account
            dashboard.
          </li>
          <li>Opting out of non-essential email notifications.</li>
        </ul>
      </>
    ),
  },
  {
    id: "contact",
    title: "8. Contact Us",
    content: (
      <>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please feel free to reach out to our team:
        </p>
        <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-5 mt-4 space-y-2">
          <p>
            <span className="font-semibold text-white">Email:</span>{" "}
            <a
              href="mailto:privacy@supporthub.io"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              privacy@supporthub.io
            </a>
          </p>
          <p>
            <span className="font-semibold text-white">Office:</span> SupportHub
            Inc., 100 Pine Street, San Francisco, CA 94111
          </p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="This Privacy Policy describes how we collect, use, process, and distribute your information when you utilize SupportHub."
      lastUpdated="May 30, 2026"
      sections={sections}
    />
  );
}
