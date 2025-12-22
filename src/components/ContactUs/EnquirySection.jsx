import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { CreateContact } from "../../axios/axios";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as LabelPrimitive from "@radix-ui/react-label";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Toast } from "../../Utils/Toast";
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput, { isValidPhoneNumber, getCountryCallingCode } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { formatPhoneNumber } from "../../Utils/FormatePhoneNumber";

// Local utility to merge Tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Inline Button
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(function Button(
  { className, variant, size, asChild = false, ...props },
  ref
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

// Inline Card
const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        className
      )}
      {...props}
    />
  );
});

const CardContent = React.forwardRef(function CardContent(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
});

// Inline Input
const Input = React.forwardRef(function Input(
  { className, type, ...props },
  ref
) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

// Inline Label
const Label = React.forwardRef(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});

// Inline Textarea
const Textarea = React.forwardRef(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

const getMapEmbedUrl = (url) => {
  const defaultEmbed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d315.5593216427424!2d145.2069111!3d-38.0078424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad613f6637330fb%3A0xd763a0ab7822508d!2sSupercheap%20Tyres%20Dandenong!5e0!3m2!1sen!2sin!4v1739450000000!5m2!1sen!2sin";

  if (!url) return defaultEmbed;

  // Check if it's already an embed URL
  if (url.includes("/embed")) return url;

  try {
    let query = "";
    // Extract place name from /place/Place+Name
    const placeMatch = url.match(/\/maps\/place\/([^/]+)/);
    if (placeMatch && placeMatch[1]) {
      query = placeMatch[1];
    } else {
      // Fallback to coordinates if present
      const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordsMatch) {
        query = `${coordsMatch[1]},${coordsMatch[2]}`;
      }
    }

    if (query) {
      // Extract zoom level if present, default to 15
      const zoomMatch = url.match(/,(\d+(\.\d+)?)z/);
      const zoom = zoomMatch ? zoomMatch[1] : "15";
      return `https://maps.google.com/maps?q=${query}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
    }
  } catch (error) {
    console.error("Error parsing map URL:", error);
  }

  return defaultEmbed;
};

export const EnquirySection = ({ contactData }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
    recaptcha: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    mobile: false,
    email: false,
    message: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const recaptchaRef = useRef(null); // Ref for reCAPTCHA
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("AU");

  const handleCursorPosition = (e) => {
    if (e.target.tagName !== "INPUT" || !selectedCountry) return;
    try {
      const callingCode = getCountryCallingCode(selectedCountry);
      const prefix = `+${callingCode}`;
      if (e.target.value.startsWith(prefix)) {
        const minPos = prefix.length;
        if (e.target.selectionStart < minPos) {
          e.target.setSelectionRange(minPos, minPos);
        }
      }
    } catch (err) {
      console.error("Error handling phone input cursor:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: "", recaptcha: "" })); // Clear recaptcha error on any field change
    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setErrors((prev) => ({ ...prev, recaptcha: "" }));
  };

  const validate = () => {
    const nextErrors = {
      name: "",
      mobile: "",
      email: "",
      message: "",
      recaptcha: "",
    };
    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.mobile) {
      nextErrors.mobile = "Mobile is required";
    } else if (!isValidPhoneNumber(formData.mobile)) {
      nextErrors.mobile = "Enter a valid phone number for selected country";
    }
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        nextErrors.email = "Please enter a valid email address";
      }
    }
    if (!formData.message.trim()) nextErrors.message = "Message is required";

    // reCAPTCHA validation
    if (!recaptchaValue) {
      nextErrors.recaptcha = "Please complete the reCAPTCHA verification";
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields as touched
    setTouched({
      name: true,
      mobile: true,
      email: true,
      message: true,
    });
    if (!validate()) return;
    try {
      setSubmitting(true);
      await CreateContact({
        name: formData.name,
        phone: formData.mobile,
        email: formData.email,
        message: formData.message,
      });
      Toast({ message: "Successfully submitted", type: "success" });
      setFormData({ name: "", mobile: "", email: "", message: "" });
      // Reset reCAPTCHA
      setRecaptchaValue(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (err) {
      // no failure toast per requirement
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: "/contactus/call.svg",
      title: "Phone",
      value: formatPhoneNumber(contactData?.phone) || "(03) 97936190",
      link: contactData?.phone ? `tel:${contactData.phone}` : "tel:(03)97936190",
    },
    {
      icon: "/contactus/email.svg",
      title: "Email",
      value: contactData?.email || "supercheaptyredandenong@gmail.com",
      link: contactData?.email ? `mailto:${contactData.email}` : "mailto:supercheaptyredandenong@gmail.com",
    },
    {
      icon: "/contactus/location.svg",
      title: "Address",
      value: contactData?.address || "114 Hammond Rd, Dandenong South VIC 3175, Australia",
      link: contactData?.mapLocation || "https://www.google.com/maps/place/Supercheap+Tyres+Dandenong/@-38.0077899,145.2065489,20.47z/data=!4m15!1m8!3m7!1s0x6ad613c03393e259:0x6e08fd31f52665a5!2s114+Hammond+Rd,+Dandenong+South+VIC+3175,+Australia!3b1!8m2!3d-38.0078006!4d145.206244!16s%2Fg%2F11csllhb_6!3m5!1s0x6ad613f6637330fb:0xd763a0ab7822508d!8m2!3d-38.0078313!4d145.2066405!16s%2Fg%2F1s04wr9dv?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D",
    },
  ];

  return (
    <section className="w-full flex flex-col px-4 md:px-6 lg:px-8 xl:px-20 py-10 xl:py-16">
      {/* Location and Contact Information Section */}
      <div className="w-full mx-auto mb-8 translate-y-[-1rem] ">
        <div>
          {/* Our Location */}
          <div className="mb-4">
            <h2 className="text-primary font-medium text-3xl mb-4">GET IN TOUCH</h2>
            <p className="text-[#7A7A7A] leading-relaxed">
              At Supercheap Tyres, we’re here to help with all your tyre and wheel needs call, email or visit us for fast, reliable service.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-5">
            <div className="flex flex-col xl:col-span-3">
              <h2 className="[font-family:'Lexend',Helvetica] font-semibold text-[#000000] text-[22px] sm:text-[26px] md:text-[28px] tracking-[0] leading-tight sm:leading-snug md:leading-normal mb-3 sm:mb-4">
                Our Location
              </h2>
              <Card className="bg-[#fdfdfe] rounded-[16px] sm:rounded-[20px] shadow-[0px_4px_4px_#00000040] border-0">
                <CardContent className="p-1 sm:p-2">
                  <iframe
                    title="Supercheap Tyres Dandenong Location"
                    className="w-full h-56 sm:h-72 md:h-80 object-cover rounded-lg"
                    src={getMapEmbedUrl(contactData?.mapLocation)}
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col xl:col-span-2">
              <h2 className="[font-family:'Lexend',Helvetica] font-semibold text-[#000000] text-[22px] sm:text-[26px] md:text-[28px] tracking-[0] leading-tight sm:leading-snug md:leading-normal mb-3 sm:mb-4">
                Contact Information
              </h2>
              <Card className="bg-[#fdfdfe] rounded-[16px] sm:rounded-[20px] shadow-[0px_4px_4px_#00000040] border-0 h-auto lg:h-[336px]">
                <CardContent className="p-4 sm:p-5 h-full flex flex-col justify-center">
                  <div className="flex flex-col gap-4 sm:gap-5">
                    {contactInfo.map((info, index) => (
                      <a
                        key={index}
                        href={info.link}
                        target={info.title === "Address" ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 hover:opacity-80 transition-opacity duration-200"
                      >
                        <div className="w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] bg-[#000000] rounded-[5px] flex items-center justify-center flex-shrink-0">
                          <img
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            alt={info.title}
                            src={info.icon}
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="[font-family:'Lexend',Helvetica] font-normal text-[#000000] text-[13px] sm:text-sm tracking-[0] leading-[normal] mb-1">
                            {info.title}
                          </div>
                          <div className="[font-family:'Lexend',Helvetica] font-normal text-[#6f6f6f] text-[10px] sm:text-[11px] tracking-[0] leading-[normal] break-all">
                            {info.value}
                          </div>
                        </div>
                      </a>
                    ))}

                    {/* Opening Hours */}
                    <div className="flex items-start gap-3">
                      <div className="w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] bg-[#000000] rounded-[5px] flex items-center justify-center flex-shrink-0">
                        <img
                          className="p-2.5 sm:p-3"
                          alt="Clock"
                          src="/contactus/clock.svg"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="[font-family:'Lexend',Helvetica] font-normal text-[#000000] text-[14px] sm:text-[15px] tracking-[0] leading-[normal] mb-1">
                          Opening Hours
                        </div>
                        <div className="[font-family:'Lexend',Helvetica] font-normal text-[#6f6f6f] text-[10px] sm:text-[11px] tracking-[0] leading-[normal]">
                          {contactData?.openingHours ? (
                            contactData.openingHours.map((h, i) => (
                              <React.Fragment key={i}>
                                {h.day}: {h.time}
                                <br />
                              </React.Fragment>
                            ))
                          ) : (
                            <>
                              Mon - Fri: 9:00am - 5pm
                              <br />
                              Sat: 9:00am - 3pm
                              <br />
                              Sun: Closed
                              <br />
                            </>
                          )}
                          {contactData?.openingHoursNote || "Please check Google for public holiday opening hours."}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Enquire Now Section */}
      <div className="w-full translate-y-[-1rem] animate-fade-in  [--animation-delay:400ms]">
        <h2 className="[font-family:'Lexend',Helvetica] font-semibold text-[#000000] text-[22px] sm:text-[26px] md:text-[28px] tracking-[0.84px] leading-[28px] sm:leading-[30px] mb-4 sm:mb-6">
          Enquire Now
        </h2>

        <div className="[font-family:'Lexend',Helvetica] max-w-6xl font-normal text-[#6E6E6E] text-sm sm:text-base tracking-[0.48px] leading-[26px] sm:leading-[30px] mb-6 sm:mb-8">
          Supercheap Tyres Dandenong is a leading tyre dealer proudly servicing the South East Melbourne region including Dandenong. Our products are spread out to a wide range that consists of budget tyres, premium tyres, SUV tyres, van tyres, 4×4 tyres, trailer tyres and more. Whether you need tyres for a daily driver, family vehicle or commercial use, we have quality options to suit every requirement. We’re committed to providing great value, offering some of the most competitive tyre prices in Melbourne along with expert fitting, wheel alignment and repair services. If you’re searching online for “tyres near me” or a reliable tyre shop in Dandenong, look no further. You can find the best deals and qualitative service on tyres at our store or online. Contact us today for assistance or a free quote.
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-[830px] translate-y-[-1rem] animate-fade-in  [--animation-delay:600ms]">
          <form
            className="flex flex-col gap-4 sm:gap-6"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <Label className="[font-family:'Lexend',Helvetica] font-normal text-[#000000] text-base tracking-[0] leading-[normal]">
                Name<span className="text-[#FF0000]">*</span>
              </Label>
              <Input
                name="name"
                placeholder="Enter your Name"
                className="h-12 sm:h-[52px] rounded-lg border border-solid border-[#7e7e7e]  [font-family:'Lexend',Helvetica] font-normal text-[#6f6f6f] text-sm tracking-[0] leading-[normal] placeholder:text-[#6f6f6f]"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && touched.name ? (
                <p className="text-red-600 text-xs mt-1">{errors.name}</p>
              ) : null}
            </div>

            {/* Mobile Field */}
            <div className="flex flex-col gap-2">
              <Label className="[font-family:'Lexend',Helvetica] font-normal text-[#000000] text-base tracking-[0] leading-[normal]">
                Mobile<span className="text-[#FF0000]">*</span>
              </Label>
              <PhoneInput
                name="mobile"
                placeholder="Enter your Mobile Number"
                value={formData.mobile}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, mobile: value }));
                  setErrors((prev) => ({ ...prev, mobile: "" }));
                  // Mark field as touched
                  setTouched((prev) => ({ ...prev, mobile: true }));
                }}
                onCountryChange={(country) => {
                  setSelectedCountry(country);
                  // Clear the phone number when country changes
                  setFormData((prev) => ({ ...prev, mobile: '' }));
                  setErrors((prev) => ({ ...prev, mobile: "" }));
                }}
                country={selectedCountry}
                defaultCountry="AU"
                international
                limitMaxLength={true}
                countryCallingCodeEditable={false}
                className={`react-phone-number-input ${errors.mobile && touched.mobile ? 'react-phone-number-input--invalid' : ''}`}
                onClick={handleCursorPosition}
                onKeyUp={handleCursorPosition}
                onFocus={handleCursorPosition}
              />
              <style>
                {`
                  .react-phone-number-input {
                    width: 100%;
                    height: 52px;
                    border-radius: 0.5rem;
                    border: 1px solid #7E7E7E;
                    overflow: hidden;
                  }
                   .react-phone-number-input--invalid,
                   .react-phone-number-input--invalid:focus-within {
                     border-color: #FF0000 !important;
                     box-shadow: 0 0 0 0px #FF000060 !important;
                     border: 0.1px solid #FF0000 !important;
                    }
                  .react-phone-number-input .PhoneInputInput {
                    padding: 0.5rem;
                    font-size: 0.875rem;
                    border: none;
                    outline: none;
                    width: 100%;
                    font-family: 'Lexend', Helvetica;
                    color: #6f6f6f;
                    background-color: #F3F3F3;
                    
                  }
                  .react-phone-number-input .PhoneInputCountry {
                    padding: 0.5rem;
                    border: none;
                  }
                  .react-phone-number-input:focus-within {
                    border-color: #7E7E7E;
                    box-shadow: 0 0 0 1px #3B82F690;
                 }
                `}
              </style>
              {errors.mobile && touched.mobile ? (
                <p className="text-red-600 text-xs mt-1">{errors.mobile}</p>
              ) : null}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <Label className="[font-family:'Lexend',Helvetica] font-normal text-[#000000] text-base tracking-[0] leading-[normal]">
                Email<span className="text-[#FF0000]">*</span>
              </Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your Email"
                className="h-12 sm:h-[52px] rounded-lg border border-solid border-[#7e7e7e] [font-family:'Lexend',Helvetica] font-normal text-[#6f6f6f] text-sm tracking-[0] leading-[normal] placeholder:text-[#6f6f6f]"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && touched.email ? (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              ) : null}
            </div>

            {/* Message Field */}
            <div className="flex flex-col gap-2">
              <Label className="[font-family:'Lexend',Helvetica] font-normal text-[#000000] text-base tracking-[0] leading-[normal]">
                Your Message<span className="text-[#FF0000]">*</span>
              </Label>
              <Textarea
                name="message"
                placeholder="Enter your message here."
                maxLength={300}
                className="h-28 sm:h-[125px] rounded-lg border border-solid border-[#7e7e7e] py-3 [font-family:'Lexend',Helvetica] font-normal text-[#6f6f6f] text-sm tracking-[0] leading-[normal] placeholder:text-[#6f6f6f] resize-none"
                value={formData.message}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 300); // double safety
                  setFormData((prev) => ({ ...prev, message: value }));
                  setErrors((prev) => ({ ...prev, message: "" }));
                  // Mark field as touched
                  setTouched((prev) => ({ ...prev, message: true }));
                }}
              />
              <div className="flex justify-between items-center">
                {errors.message && touched.message ? (
                  <p className="text-red-600 text-xs mt-1">{errors.message}</p>
                ) : (
                  <span className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/300
                  </span>
                )}
              </div>
            </div>

            {/* reCAPTCHA */}
            <div>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
              />
              {errors.recaptcha ? (
                <p className="text-red-600 text-xs mt-1">{errors.recaptcha}</p>
              ) : null}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 sm:h-[50px] bg-[#ed1c24] hover:bg-[#d11920] text-white rounded-lg [font-family:'Lexend',Helvetica] font-semibold text-base tracking-[0] leading-[normal] transition-colors disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
