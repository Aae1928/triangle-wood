import React, { useState } from 'react';
import { submitSampleRequest } from '../data/supabaseWebsiteData';
import {
  getFlooringOptions,
  getParquetryOptions,
  getTimberOptions,
} from '../data/catalogueOptions';
import { useModalBehavior } from '../hooks/useModalBehavior';
import projectImage from '../assets/Request A Quote/Your Project.webp';
import detailsImage from '../assets/Request A Quote/YOUR DETAILS.webp';
import moreProjectImage from '../assets/Request A Quote/TELL US MORE ABOUT YOUR PROJECT.webp';
import locationImage from '../assets/Request A Quote/WHEREVER YOUR PROJECT IS..webp';
import bordersImage from '../assets/Request A Quote/A PROJECT WITHOUT BORDERS.webp';
import thankYouImage from '../assets/Request A Quote/THANK YOU FOR THINKING OF TRIANGLE WOOD..webp';

interface RequestSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const projectTypes = [
  'Private Residence',
  'Residential Development',
  'Hotel & Hospitality',
  'Commercial & Office',
  'Retail & Showrooms',
  'Yacht & Marine',
  'Landscape & Outdoor',
  'Other',
];
const projectTimelines = [
  'Currently Planning',
  'Within 3 Months',
  'Within 6 Months',
  'Within 12 Months',
  'Just Exploring Possibilities',
];
const professions = [
  'Architect / Interior Designer',
  'Developer / Contractor',
  'Homeowner',
  'Business / Property Owner',
  'Procurement / Project Manager',
  'Distributor / Trade Partner',
  'Other',
];
const contactMethods = ['Email', 'Phone', 'WhatsApp', 'No Preference'];
const supportOptions = [
  {
    title: 'Product Supply & International Delivery',
    detail: 'International product supply and delivery.',
  },
  {
    title: 'Supply & Installation',
    detail: "Installation by TRIANGLE WOOD's team.",
  },
  {
    title: 'Technical & Specification Support',
    detail: 'Technical guidance for local installation teams.',
  },
  {
    title: "I'd Like to Discuss the Possibilities",
    detail: 'Installation through approved local partners.',
  },
];

const inputClass =
  'w-full rounded-lg border border-[#d8d5cf] bg-white/65 px-3 py-2.5 text-sm text-[#171717] placeholder-[#6b7280] backdrop-blur-[2px] focus:border-[#ba8c62] focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#4b5563]';
const sectionClass = 'space-y-4';

const QuoteSection: React.FC<{
  image: string;
  children: React.ReactNode;
  className?: string;
}> = ({ image, children, className = '' }) => (
  <section className={`relative isolate -mx-6 overflow-hidden md:-mx-9 ${className}`}>
    <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" />
    <div className="absolute inset-0 bg-white/45" />
    <div className="relative space-y-4 px-6 py-6 md:px-9">{children}</div>
  </section>
);

export const RequestSampleModal: React.FC<RequestSampleModalProps> = ({ isOpen, onClose }) => {
  const [selectedFlooringProducts, setSelectedFlooringProducts] = useState<string[]>([]);
  const [selectedAdditionalProducts, setSelectedAdditionalProducts] = useState<string[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [profession, setProfession] = useState('');
  const [preferredContact, setPreferredContact] = useState('');
  const [projectType, setProjectType] = useState('');
  const [projectTimeline, setProjectTimeline] = useState('');
  const [area, setArea] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [support, setSupport] = useState<string[]>([]);
  const [differentDeliveryAddress, setDifferentDeliveryAddress] = useState(false);
  const [deliveryCountry, setDeliveryCountry] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [moreDetails, setMoreDetails] = useState('');
  const [planFiles, setPlanFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useModalBehavior(isOpen, onClose);
  if (!isOpen) return null;

  const flooringOptions = getFlooringOptions();
  const parquetryOptions = getParquetryOptions();
  const timberOptions = getTimberOptions();

  const toggleOption = (options: string[], setOptions: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setOptions((current) =>
      current.includes(value) ? current.filter((option) => option !== value) : [...current, value],
    );
  };
  const toggleProduct = (id: string) =>
    toggleOption(selectedAdditionalProducts, setSelectedAdditionalProducts, id);
  const toggleFlooring = (id: string) =>
    toggleOption(selectedFlooringProducts, setSelectedFlooringProducts, id);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const selectedFlooring = flooringOptions.filter(({ id }) =>
        selectedFlooringProducts.includes(id),
      );
      if (!selectedFlooring.length && !selectedAdditionalProducts.length) {
        throw new Error('Select at least one product before submitting your enquiry.');
      }

      const enquiryDetails = [
        `Project type: ${projectType}`,
        `Project timeline: ${projectTimeline || 'Not provided'}`,
        `Approximate area (m²): ${area || 'Not provided'}`,
        `Project location: ${city}, ${country}`,
        `Company / Organisation: ${company || 'Not provided'}`,
        `Profession: ${profession || 'Not provided'}`,
        `Preferred contact method: ${preferredContact || 'Not provided'}`,
        `Support requested: ${support.join('; ')}`,
        differentDeliveryAddress
          ? `Different delivery location: ${deliveryCity}, ${deliveryCountry}`
          : 'Delivery address is the same as the project location.',
        planFiles.length ? `Plans / inspiration selected: ${planFiles.map(({ name }) => name).join(', ')}` : '',
        moreDetails.trim() ? `Project details: ${moreDetails.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      await submitSampleRequest({
        fullName,
        email,
        phone,
        company,
        city,
        moreDetails: enquiryDetails,
        selectedFlooringProducts: selectedFlooring.map(({ colorName, patternName }) => ({
          colorName,
          patternName,
        })),
        additionalProducts: selectedAdditionalProducts,
      });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'The project enquiry could not be submitted.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#e5e2dd] bg-white p-6 text-[#171717] shadow-2xl md:p-9">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quote enquiry"
          className="absolute right-4 top-4 rounded-lg p-2 text-[#6b7280] hover:bg-[#f1f1ef] hover:text-[#171717]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSubmitted ? (
          <QuoteSection image={thankYouImage} className="-mt-6 text-center md:-mt-9">
            <div className="space-y-4 py-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#ba8c62] bg-[#ba8c62]/10 text-[#ba8c62]">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif-luxury text-xl uppercase tracking-wider md:text-2xl">
                THANK YOU FOR THINKING OF TRIANGLE WOOD.
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#4b5563]">
                We&apos;ve received your project enquiry, and we&apos;re looking forward to learning more
                about what you&apos;re creating. Our team will be in touch personally to discuss the next
                steps. You can expect to hear from us within one business day.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="mt-4 rounded bg-[#E4D5BE] px-8 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#d8c3a6]"
              >
                Close
              </button>
            </div>
          </QuoteSection>
        ) : (
          <>
            <header className="mb-7 pr-8">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.25em] text-[#ba8c62]">
                TELL US WHAT CAUGHT YOUR EYE
              </span>
              <h1 className="mt-1 font-serif-luxury text-2xl uppercase tracking-wide md:text-3xl">
                REQUEST A QUOTE
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6b7280]">
                Whether you have a clear specification or are still exploring ideas, our team is here
                to help you find the right solution.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-0">
              <section className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Your Selection</h2>
                  <p className="mt-1 text-xs text-[#6b7280]">What caught your eye? Select one or more products.</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {flooringOptions.map((product) => {
                    const checked = selectedFlooringProducts.includes(product.id);
                    return (
                      <button
                        type="button"
                        key={product.id}
                        onClick={() => toggleFlooring(product.id)}
                        aria-pressed={checked}
                        className={`flex min-h-16 min-w-0 items-center gap-2 rounded-lg border p-2 text-left ${
                          checked ? 'border-[#ba8c62] bg-[#f5f1ea]' : 'border-[#e5e2dd]'
                        }`}
                      >
                        {product.imageUrl && <img src={product.imageUrl} alt="" className="h-12 w-12 shrink-0 object-contain" />}
                        <span className="text-[0.6875rem] font-semibold uppercase tracking-wider">{product.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-4 border-t border-[#e5e2dd] pt-4">
                  {[
                    { title: 'PARQUETRY', options: parquetryOptions },
                    { title: 'TIMBER SOLUTIONS', options: timberOptions },
                  ].map(({ title, options }) => (
                    <fieldset key={title}>
                      <legend className="mb-2 text-xs font-mono uppercase tracking-wider text-[#8b7252]">{title}</legend>
                      <div className={`grid gap-2 ${title === 'PARQUETRY' ? 'grid-cols-2 sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                        {options.map((product) => {
                          const checked = selectedAdditionalProducts.includes(product.id);
                          return (
                            <button
                              type="button"
                              key={product.id}
                              onClick={() => toggleProduct(product.id)}
                              aria-pressed={checked}
                              className={`flex min-h-16 min-w-0 items-center gap-2 rounded-lg border p-2 text-left text-xs font-medium uppercase tracking-wider ${
                                checked ? 'border-[#ba8c62] bg-[#f5f1ea]' : 'border-[#e5e2dd]'
                              }`}
                            >
                              {title === 'PARQUETRY' && product.imageUrl && (
                                <img src={product.imageUrl} alt="" loading="lazy" className="h-12 w-12 shrink-0 object-contain" />
                              )}
                              <span className="min-w-0 break-words">{product.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>
              </section>

              <QuoteSection image={projectImage} className={sectionClass}>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Your Project</h2>
                  <p className="mt-1 text-xs text-[#6b7280]">Tell us a little about your project.</p>
                </div>
                <fieldset>
                  <legend className={labelClass}>What kind of project is it? <span className="text-[#ba8c62]">Required</span></legend>
                  <select
                    required
                    value={projectType}
                    onChange={(event) => setProjectType(event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Choose your project type</option>
                    {projectTypes.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </fieldset>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="project-area">Approximate area (m²) <span className="text-[#9ca3af]">Optional</span></label>
                    <input id="project-area" type="number" min="0" value={area} onChange={(event) => setArea(event.target.value)} placeholder="e.g. 120" className={inputClass} />
                  </div>
                  <fieldset>
                    <legend className={labelClass}>When are you planning to begin? <span className="text-[#9ca3af]">Optional</span></legend>
                    <select value={projectTimeline} onChange={(event) => setProjectTimeline(event.target.value)} className={inputClass}>
                      <option value="">Choose a timeframe</option>
                      {projectTimelines.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </fieldset>
                </div>
              </QuoteSection>

              <QuoteSection image={detailsImage} className={sectionClass}>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Your Details</h2>
                  <p className="mt-1 text-xs text-[#6b7280]">Let&apos;s get to know you. Leave us your details and we&apos;ll be happy to take things forward with you.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="full-name">Your Name <span className="text-[#ba8c62]">Required</span></label>
                    <input id="full-name" required value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="company">Company / Organisation <span className="text-[#9ca3af]">Optional</span></label>
                    <input id="company" value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="email">Email Address <span className="text-[#ba8c62]">Required</span></label>
                    <input id="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="phone">Phone / WhatsApp <span className="text-[#9ca3af]">Optional</span></label>
                    <input id="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" className={inputClass} />
                  </div>
                </div>
                <fieldset>
                  <legend className={labelClass}>Your Profession <span className="text-[#9ca3af]">Optional</span></legend>
                  <select
                    value={profession}
                    onChange={(event) => setProfession(event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Choose your profession</option>
                    {professions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </fieldset>
                <fieldset>
                  <legend className={labelClass}>How would you prefer us to reach you? <span className="text-[#9ca3af]">Optional</span></legend>
                  <select
                    value={preferredContact}
                    onChange={(event) => setPreferredContact(event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Choose a contact method</option>
                    {contactMethods.map((method) => <option key={method}>{method}</option>)}
                  </select>
                </fieldset>
              </QuoteSection>

              <QuoteSection image={moreProjectImage} className={sectionClass}>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Tell Us More About Your Project</h2>
                  <p className="mt-1 text-xs text-[#6b7280]">Anything you&apos;d like us to know about your project? We&apos;d love to hear about it.</p>
                </div>
                <label className="block">
                  <span className={labelClass}>Share Your Plans or Inspiration <span className="text-[#9ca3af]">Optional</span></span>
                  <span className="mb-2 block text-xs text-[#6b7280]">PDF, JPG, PNG and DWG uploads</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.dwg,application/pdf,image/jpeg,image/png"
                    onChange={(event) => setPlanFiles(Array.from(event.target.files ?? []))}
                    className="block w-full rounded-lg border border-dashed border-[#c9c6c0] bg-[#f8f8f6] p-3 text-sm file:mr-3 file:rounded file:border-0 file:bg-[#e4d5be] file:px-3 file:py-2 file:text-xs file:font-semibold"
                  />
                </label>
                {planFiles.length > 0 && <p className="text-xs text-[#4b5563]">Selected: {planFiles.map(({ name }) => name).join(', ')}</p>}
                <label className="block">
                  <span className={labelClass}>Project notes <span className="text-[#9ca3af]">Optional</span></span>
                  <textarea rows={4} value={moreDetails} onChange={(event) => setMoreDetails(event.target.value)} className={`${inputClass} resize-y`} />
                </label>
              </QuoteSection>

              <QuoteSection image={locationImage} className={sectionClass}>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Wherever Your Project Is.</h2>
                  <h3 className="mt-1 text-xs font-semibold uppercase tracking-wider">Project Location</h3>
                  <p className="mt-1 text-xs text-[#6b7280]">We would love to know where you&apos;re planning to bring timber into your space. Our team will help you explore the right delivery and installation arrangements with you.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="project-country">Country of Project <span className="text-[#ba8c62]">Required</span></label>
                    <input id="project-country" required value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Enter the country" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="project-city">City <span className="text-[#ba8c62]">Required</span></label>
                    <input id="project-city" required value={city} onChange={(event) => setCity(event.target.value)} placeholder="Enter the city" className={inputClass} />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">How Can We Help You?</h2>
                  <p className="mt-1 text-xs text-[#6b7280]">Choose the support you&apos;d like from our team. <span className="text-[#ba8c62]">Required</span></p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {supportOptions.map(({ title, detail }) => {
                    const checked = support.includes(title);
                    return (
                      <label key={title} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${checked ? 'border-[#ba8c62] bg-[#f5f1ea]' : 'border-[#e5e2dd]'}`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleOption(support, setSupport, title)} className="mt-1 accent-[#ba8c62]" />
                        <span><span className="block text-sm font-medium">{title}</span><span className="mt-1 block text-xs text-[#6b7280]">{detail}</span></span>
                      </label>
                    );
                  })}
                </div>
              </QuoteSection>

              <QuoteSection image={bordersImage} className={sectionClass}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">A Project Without Borders</h2>
                <p className="text-sm leading-relaxed text-[#4b5563]">
                  From a private residence to a large architectural development, we&apos;re happy to
                  discuss projects wherever they may be. Tell us where you&apos;re building, and
                  we&apos;ll explore the most suitable delivery and installation arrangements.
                </p>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <input type="checkbox" checked={differentDeliveryAddress} onChange={(event) => setDifferentDeliveryAddress(event.target.checked)} className="accent-[#ba8c62]" />
                  Is the delivery address different from the project location?
                </label>
                {differentDeliveryAddress && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="delivery-country">Delivery Country <span className="text-[#ba8c62]">Required</span></label>
                      <input id="delivery-country" required value={deliveryCountry} onChange={(event) => setDeliveryCountry(event.target.value)} placeholder="Enter the country" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="delivery-city">Delivery City <span className="text-[#ba8c62]">Required</span></label>
                      <input id="delivery-city" required value={deliveryCity} onChange={(event) => setDeliveryCity(event.target.value)} placeholder="Enter the city" className={inputClass} />
                    </div>
                  </div>
                )}
              </QuoteSection>

              {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}
              <div className="flex justify-end border-t border-[#e5e2dd] pt-5">
                <button type="submit" disabled={isSubmitting || support.length === 0} className="rounded bg-[#ba8c62] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#a87950] disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? 'SENDING…' : 'SEND MY ENQUIRY'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
