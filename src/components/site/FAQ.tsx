import React from 'react';
import { Accordion } from '../ui/Accordion';

export const FAQ: React.FC = () => {
  const faqItems = [
    {
      id: 'faq-1',
      title: 'How does the post-purchase onboarding redirect work?',
      content:
        'Upon successful Shopify order completion, the thank-you screen executes an automated 5-second redirect into the custom Tally onboarding form. The order number and pre-generated Account ID are passed via URL query parameters, so the customer never has to re-type their credentials.',
    },
    {
      id: 'faq-2',
      title: 'How are multi-row CSV imports matched to customer profiles?',
      content:
        'The Google Sheets and Make.com scenario cross-references the Account ID in each CSV row against the Customer Parameters master sheet. Sender return addresses and brand styling attributes are automatically merged with individual recipient rows using a composite key (Account ID + Recipient Name).',
    },
    {
      id: 'faq-3',
      title: 'What happens when a CSV row has an invalid postcode or missing field?',
      content:
        'Rather than failing the whole batch, the Make router diverts only the invalid bundle into a Break directive. The row is recorded in the Error Log tab, and an automated alert email is triggered to the ops team. Once corrected, the row can be retried directly without re-uploading the CSV.',
    },
    {
      id: 'faq-4',
      title: 'Are live APIs and real customer credit cards used in this demo?',
      content:
        'No. This is an interactive concept prototype built with deterministic mock data and simulated async functions. All API requests target sandbox mock endpoints, and no real card charges or email transmissions take place.',
    },
    {
      id: 'faq-5',
      title: 'How is security handled with sandbox keys and collaborator access?',
      content:
        'The pipeline architecture enforces strict least-privilege principles: all development runs exclusively against sandbox endpoints with masked keys. Shopify Collaborator access ensures no primary store owner passwords are ever shared.',
    },
    {
      id: 'faq-6',
      title: 'What is included in the ongoing monthly retainer?',
      content:
        'The retainer covers scenario health monitoring, error log queue reviews, upstream API deprecation updates, and up to 3 minor workflow adjustments per month, with guaranteed response SLAs.',
    },
  ];

  return (
    <section className="w-full py-16 border-t border-[#E3DED5]">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-wider text-[#B5654A] font-semibold">
            Frequently Asked Questions
          </span>
          <h2 className="font-display text-3xl text-[#1F2421] font-normal mt-2">
            Engineered for clarity and reliability
          </h2>
          <p className="text-sm text-[#4A524D] mt-2">
            How the automated pipeline handles edge cases, retries, and data transformations.
          </p>
        </div>

        <Accordion items={faqItems} defaultOpenId="faq-1" />
      </div>
    </section>
  );
};
