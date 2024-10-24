"use client";

import { useState, FormEvent } from "react";
import { User, Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Button from "../buttons/Button";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
// import { generateOTP } from "@/utils/otp";
// import AlertCard from "./AlertCard";

export default function RegisterForm() {
	const [loading, setLoading] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	// const [errMsg, setErrMsg] = useState("");
	const router = useRouter();

	const validateEmail = (email: string) => {
		return /\S+@\S+\.\S+/.test(email);
	};

	const validatePassword = (password: string) => {
		if (password.length < 6)
			return "Password must be at least 6 characters long.";
		if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(password))
			return "Password must contain both letters and numbers";
		return "";
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: string
	) => {
		const { value } = e.target;
		switch (field) {
			case "firstName":
				setFirstName(value);
				setErrors((prev) => ({
					...prev,
					firstName: value ? "" : "First name is required",
				}));
				break;
			case "lastName":
				setLastName(value);
				setErrors((prev) => ({
					...prev,
					lastName: value ? "" : "Last name is required",
				}));
				break;
			case "email":
				setEmail(value);
				setErrors((prev) => ({
					...prev,
					email: value
						? validateEmail(value)
							? ""
							: "Invalid email format"
						: "Email is required",
				}));
				break;
			case "password":
				setPassword(value);
				setErrors((prev) => ({
					...prev,
					password: value ? validatePassword(value) : "Password is required",
				}));
				break;
		}
	};

	const handleRegistration = async (e: FormEvent) => {
		e.preventDefault();

		const newErrors = {
			firstName: firstName ? "" : "First name is required",
			lastName: lastName ? "" : "Last name is required",
			email: email
				? validateEmail(email)
					? ""
					: "Invalid email format"
				: "Email is required",
			password: password ? validatePassword(password) : "Password is required",
		};

		setErrors(newErrors);

		if (!Object.values(newErrors).some((error) => error)) {
			try {
				setLoading(true);

				const { user } = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);

				// Generate OTP and expiration
				// const { otp, otpExpiredAt } = generateOTP();

				// Save user data to Firestore
				const userData = {
					firstName,
					lastName,
					email,
					id: user.uid,
					photoURL: "",
					address: "",
					city: "",
					country: "",
					phoneNumber: "",
					displayName: `${firstName} ${lastName}`,
					// otpCode: otp,
					// otpExpiredAt: otpExpiredAt,
					// isEmailVerified: true,
					createdAt: new Date(),
				};

				await setDoc(doc(db, "users", user.uid), userData);

				// Send OTP Code
				// try {
				// 	const response = await fetch("/api/send", {
				// 		method: "POST",
				// 		headers: { "Content-Type": "application/json" },
				// 		body: JSON.stringify({ firstName, email, otp }),
				// 	});

				// 	const responseData = await response.json();

				// 	if (response.ok) {
				// 		toast.success(
				// 			"Account created successfully! \n Please verify your email."
				// 		);

				// 	} else {
				// 		toast.error(`Failed to send OTP: ${responseData.error}`);
				// 	}
				// } catch (error) {
				// 	toast.error("An error occurred while sending OTP");
				// 	console.error("Error sending Register OTP:", error);
				// }

				// store the email, firstName, and user.uid  in session storage
				// sessionStorage.setItem("userId", user.uid);
				// sessionStorage.setItem("UserEmail", email);
				// sessionStorage.setItem("userFirstName", firstName);

				// Temporary store user data in local storage
				localStorage.setItem(
					"registrationData",
					JSON.stringify({
						userData,
					})
				);

				// Immediately sign out the user after registration
				await signOut(auth);

				router.push("/sign-in");
				setFirstName("");
				setLastName("");
				setEmail("");
				setPassword("");
			} catch (error: any) {
				let errorMessage;
				switch (error.code) {
					case "auth/invalid-email":
						errorMessage = "Please enter a valid email.";
						break;
					case "auth/missing-password":
						errorMessage = "Please enter a password.";
						break;
					case "auth/email-already-in-use":
						errorMessage = "This email is already in use. Try another email.";
						break;
					default:
						errorMessage = "An error occurred. Please try again.";
				}
				// console.log("Error", error);
				toast.error(errorMessage);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div>
			{/* Registration Form */}
			<div className="flex-1 w-full max-w-full md:max-w-[400px] pt-3 px-4 sm:px-0 mt-5 sm:mt-0">
				{/* Heading */}
				<h1 className="heading">Sign Up</h1>

				{/* Headline */}
				<p className="headline">Enter your credentials to create an account</p>

				{/* Form */}
				<form onSubmit={handleRegistration}>
					<div className="mb-4">
						{/* First Name field */}
						<label htmlFor="firstName" className="label-heading">
							First Name <span className="text-error dark:text-red-500">*</span>
						</label>
						<div className="relative">
							<input
								type="text"
								id="firstName"
								className={`w-full p-4 border ${
									errors.firstName ? "border-error" : "border-gold-border"
								} rounded-md text-[#101928] dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-gray-400 text-sm leading-[20.3px] focus:outline-none focus:ring-2 focus:ring-gold-border`}
								placeholder="Enter your first name"
								value={firstName}
								onChange={(e) => handleInputChange(e, "firstName")}
							/>
							<span className="absolute inset-y-0 right-0 pr-[18px] flex items-center">
								<User className="text-gray-light w-5 h-5" />
							</span>
						</div>
						{errors.firstName && (
							<p className="mt-2 text-error dark:text-red-500 text-sm">
								{errors.firstName}
							</p>
						)}
					</div>

					<div className="mb-4">
						{/* Last Name field */}
						<label htmlFor="lastName" className="label-heading">
							Last Name <span className="text-error dark:text-red-500">*</span>
						</label>
						<div className="relative">
							<input
								type="text"
								id="lastName"
								className={`w-full p-4 border ${
									errors.lastName ? "border-error" : "border-gold-border"
								} rounded-md text-[#101928] dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-gray-400 text-sm leading-[20.3px] focus:outline-none focus:ring-2 focus:ring-gold-border`}
								placeholder="Enter your last name"
								value={lastName}
								onChange={(e) => handleInputChange(e, "lastName")}
							/>
							<span className="absolute inset-y-0 right-0 pr-[18px] flex items-center">
								<User className="text-gray-light w-5 h-5" />
							</span>
						</div>
						{errors.lastName && (
							<p className="mt-2 text-error dark:text-red-500 text-sm">
								{errors.lastName}
							</p>
						)}
					</div>

					<div className="mb-4">
						{/* Email field */}
						<label htmlFor="email" className="label-heading">
							Email Address{" "}
							<span className="text-error dark:text-red-500">*</span>
						</label>
						<div className="relative">
							<input
								type="email"
								id="email"
								className={`w-full p-4 border ${
									errors.email ? "border-error" : "border-gold-border"
								} rounded-md text-[#101928] dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-gray-400 text-sm leading-[20.3px] focus:outline-none focus:ring-2 focus:ring-gold-border`}
								placeholder="Enter your email"
								value={email}
								onChange={(e) => handleInputChange(e, "email")}
							/>
							<span className="absolute inset-y-0 right-0 pr-[18px] flex items-center">
								<Mail className="text-gray-light w-5 h-5" />
							</span>
						</div>
						{errors.email && (
							<p className="mt-2 text-error dark:text-red-500 text-sm">
								{errors.email}
							</p>
						)}
					</div>

					<div className="mb-4">
						{/* Password field */}
						<label htmlFor="password" className="label-heading">
							Password <span className="text-error dark:text-red-500">*</span>
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								className={`w-full p-4 border ${
									errors.password ? "border-error" : "border-gold-border"
								} rounded-md text-[#101928] dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-gray-400 text-sm leading-[20.3px] focus:outline-none focus:ring-2 focus:ring-gold-border`}
								placeholder="Enter your password"
								value={password}
								onChange={(e) => handleInputChange(e, "password")}
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-[18px] flex items-center"
								onClick={() => setShowPassword(!showPassword)}
								disabled={loading}
							>
								{showPassword ? (
									<EyeOff className="text-gray-light w-5 h-5" />
								) : (
									<Eye className="text-gray-light w-5 h-5" />
								)}
							</button>
						</div>
						{errors.password && (
							<p className="mt-2 text-error dark:text-red-500 text-sm">
								{errors.password}
							</p>
						)}
					</div>

					<p className="text-sm text-gray-light dark:text-gray-400 font-libre-franklin font-medium pb-4">
						By creating an account, you agree to our{" "}
						<Link
							href="/privacy-policy"
							className="text-gray-700 dark:text-gold-text underline"
						>
							privacy policy
						</Link>{" "}
						and{" "}
						<Link
							href="/terms-of-use"
							className="text-gray-700 dark:text-gold-text underline"
						>
							terms and conditions
						</Link>
						.
					</p>

					{/* Submit form */}
					<Button
						type="submit"
						label={loading ? "Creating account..." : "Create Account"}
						className="mt-4"
						disabled={loading}
					/>
				</form>

				<p className="flex gap-1 justify-center items-center font-libre-franklin font-normal text-sm text-gray-light dark:text-gray-300 mt-6">
					Already have an account?
					<Link
						href="/sign-in"
						className="py-1 px-2 font-medium text-gold-text hover:underline"
					>
						Log in
					</Link>
				</p>

				<div className="flex items-center justify-center my-10 lg:hidden">
					<Image
						src="/logo-black.svg"
						width={60}
						height={60}
						alt="DNBL logo"
						className="dark:invert"
					/>
				</div>
			</div>
		</div>
	);
}
