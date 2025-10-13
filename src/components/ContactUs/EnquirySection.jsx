import React, { useState } from "react";
import { toast } from "react-toastify";
import { CreateContact } from "../../axios/axios";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as LabelPrimitive from "@radix-ui/react-label";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
    },
);

const Button = React.forwardRef(function Button(
    { className, variant, size, asChild = false, ...props },
    ref,
) {
    const Comp = asChild ? Slot : "button";
    return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
});

// Inline Card
const Card = React.forwardRef(function Card({ className, ...props }, ref) {
    return (
        <div
            ref={ref}
            className={cn(
                "rounded-xl border bg-card text-card-foreground shadow",
                className,
            )}
            {...props}
        />
    );
});

const CardContent = React.forwardRef(function CardContent(
    { className, ...props },
    ref,
) {
    return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
});

// Inline Input
const Input = React.forwardRef(function Input({ className, type, ...props }, ref) {
    return (
        <input
            type={type}
            className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className,
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
                className,
            )}
            {...props}
        />
    );
});

// Inline Textarea
const Textarea = React.forwardRef(function Textarea({ className, ...props }, ref) {
    return (
        <textarea
            className={cn(
                "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});

export const EnquirySection = () => {
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
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const nextErrors = { name: "", mobile: "", email: "", message: "" };
        if (!formData.name.trim()) nextErrors.name = "Name is required";
        if (!formData.mobile.trim()) nextErrors.mobile = "Mobile is required";
        if (!formData.email.trim()) nextErrors.email = "Email is required";
        if (!formData.message.trim()) nextErrors.message = "Message is required";
        setErrors(nextErrors);
        return !Object.values(nextErrors).some(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            setSubmitting(true);
            await CreateContact({
                name: formData.name,
                phone: formData.mobile,
                email: formData.email,
                message: formData.message,
            });
            toast.success("Successfully submitted", { position: "top-right" });
            setFormData({ name: "", mobile: "", email: "", message: "" });
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
            value: "1234567832",
        },
        {
            icon: "/contactus/email.svg",
            title: "Email",
            value: "supercheaptyredandenong@gmail.com",
        },
        {
            icon: "/contactus/location.svg",
            title: "Address",
            value: "114 Hammond Rd, Dandenong South VIC, 3175",
        },
    ];

    return (
        <section className="w-full flex flex-col px-4 py-6 sm:py-8">
            {/* Location and Contact Information Section */}
            <div className="w-full max-w-[1327px] mx-auto mb-8 translate-y-[-1rem] ">
                <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-5">
                    {/* Our Location */}
                    <div className="flex flex-col lg:col-span-3">
                        <h2 className="[font-family:'Lexend',Helvetica] font-semibold text-[#000000] text-[22px] sm:text-[26px] md:text-[28px] tracking-[0] leading-tight sm:leading-snug md:leading-normal mb-3 sm:mb-4">
                            Our Location
                        </h2>
                        <Card className="bg-[#fdfdfe] rounded-[16px] sm:rounded-[20px] shadow-[0px_4px_4px_#00000040] border-0">
                            <CardContent className="p-1 sm:p-2">
                                <iframe
                                    title="New Delhi Location"
                                    className="w-full h-56 sm:h-72 md:h-80 object-cover rounded-lg"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.346785820778!2d77.20902181508345!3d28.6139399824275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd35b5b2bdc7%3A0x4c06f3b7e5a7e2b7!2sNew%20Delhi%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sin!4v1738176000000!5m2!1sen!2sin"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Information */}
                    <div className="flex flex-col lg:col-span-2">
                        <h2 className="[font-family:'Lexend',Helvetica] font-semibold text-[#000000] text-[22px] sm:text-[26px] md:text-[28px] tracking-[0] leading-tight sm:leading-snug md:leading-normal mb-3 sm:mb-4">
                            Contact Information
                        </h2>
                        <Card className="bg-[#fdfdfe] rounded-[16px] sm:rounded-[20px] shadow-[0px_4px_4px_#00000040] border-0 h-auto lg:h-[336px]">
                            <CardContent className="p-4 sm:p-5 h-full flex flex-col justify-center">
                                <div className="flex flex-col gap-4 sm:gap-5">
                                    {contactInfo.map((info, index) => (
                                        <div key={index} className="flex items-start gap-3">
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
                                                <div className="[font-family:'Lexend',Helvetica] font-normal text-[#6f6f6f] text-[10px] sm:text-[11px] tracking-[0] leading-[normal]">
                                                    {info.value}
                                                </div>
                                            </div>
                                        </div>
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
                                                Mon - Fri: 9:00am - 5pm
                                                <br />
                                                Sat: 9:00am - 3pm
                                                <br />
                                                Sun: Closed
                                                <br />
                                                Please check Google for public holiday opening hours.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Enquire Now Section */}
            <div className="w-full max-w-[1181px] lg:px-20 translate-y-[-1rem] animate-fade-in  [--animation-delay:400ms]">
                <h2 className="[font-family:'Lexend',Helvetica] font-semibold text-[#000000] text-[22px] sm:text-[26px] md:text-[28px] tracking-[0.84px] leading-[28px] sm:leading-[30px] mb-4 sm:mb-6">
                    Enquire Now
                </h2>

                <div className="[font-family:'Lexend',Helvetica] font-normal text-[#6E6E6E] text-sm sm:text-base tracking-[0.48px] leading-[26px] sm:leading-[30px] mb-6 sm:mb-8">
                    Supercheap Tyres Dandenong is your number one tyre dealer and tyre
                    shop in Dandenong and the surrounding areas.
                    <br />
                    We stock a huge variety of products, including cheap tyres, discount
                    tyres, SUV tyres, van tyres, 4WD tyres, trailer tyres, and more.
                    <br />
                    Whether you're looking to buy tyres for your car, SUV, or trailer,
                    we've got you covered.
                    <br />
                    Looking for great deals on tyres and tyre services nearby? We offer
                    some of the cheapest tyres in Melbourne, along with expert wheel
                    alignment services.
                    <br />
                    Whether you're searching for "tyres near me" or "tire shop near me,"
                    we've got you covered.
                    <br />
                    Visit us today or check out our tyres online for the best deals in
                    South East Melbourne, including Dandenong. Contact us for more
                    information!
                </div>

                {/* Contact Form */}
                <div className="w-full max-w-[830px] translate-y-[-1rem] animate-fade-in  [--animation-delay:600ms]">
                    <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleSubmit} noValidate>
                        {/* Name Field */}
                        <div className="flex flex-col gap-2">
                            <Label className="[font-family:'Lexend',Helvetica] font-normal text-[#000000] text-base tracking-[0] leading-[normal]">
                                Name
                            </Label>
                            <Input
                                name="name"
                                placeholder="Enter your Name"
                                className="h-12 sm:h-[52px] rounded-lg border border-solid border-[#7e7e7e]  [font-family:'Lexend',Helvetica] font-normal text-[#6f6f6f] text-sm tracking-[0] leading-[normal] placeholder:text-[#6f6f6f]"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name ? (
                                <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                            ) : null}
                        </div>

                        {/* Mobile Field */}
                        <div className="flex flex-col gap-2">
                            <Label className="[font-family:'Lexend',Helvetica] font-normal text-[#000000] text-base tracking-[0] leading-[normal]">
                                Mobile
                            </Label>
                            <Input
                                name="mobile"
                                placeholder="Enter your Mobile Number"
                                className="h-12 sm:h-[52px] rounded-lg border border-solid border-[#7e7e7e] [font-family:'Lexend',Helvetica] font-normal text-[#6f6f6f] text-sm tracking-[0] leading-[normal] placeholder:text-[#6f6f6f]"
                                value={formData.mobile}
                                onChange={handleChange}
                            />
                            {errors.mobile ? (
                                <p className="text-red-600 text-xs mt-1">{errors.mobile}</p>
                            ) : null}
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col gap-2">
                            <Label className="[font-family:'Lexend',Helvetica] font-normal text-[#000000] text-base tracking-[0] leading-[normal]">
                                Email
                            </Label>
                            <Input
                                name="email"
                                placeholder="Enter your Email"
                                className="h-12 sm:h-[52px] rounded-lg border border-solid border-[#7e7e7e] [font-family:'Lexend',Helvetica] font-normal text-[#6f6f6f] text-sm tracking-[0] leading-[normal] placeholder:text-[#6f6f6f]"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email ? (
                                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                            ) : null}
                        </div>

                        {/* Message Field */}
                        <div className="flex flex-col gap-2">
                            <Label className="[font-family:'Lexend',Helvetica] font-normal text-[#000000] text-base tracking-[0] leading-[normal]">
                                Your Message
                            </Label>
                            <Textarea
                                name="message"
                                placeholder="Enter your message here."
                                className="h-28 sm:h-[125px] rounded-lg border border-solid border-[#7e7e7e] py-3 [font-family:'Lexend',Helvetica] font-normal text-[#6f6f6f] text-sm tracking-[0] leading-[normal] placeholder:text-[#6f6f6f] resize-none"
                                value={formData.message}
                                onChange={handleChange}
                            />
                            {errors.message ? (
                                <p className="text-red-600 text-xs mt-1">{errors.message}</p>
                            ) : null}
                        </div>

                        {/* reCAPTCHA */}
                        {/* <div className="w-[347px] h-[60px] rounded-lg border border-solid border-[#7e7e7e] flex items-center px-5 gap-4"> */}
                        <div>
                            <div
                                className="g-recaptcha"
                                data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                            ></div>
                            <script src="https://www.google.com/recaptcha/api.js" async defer></script>

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
