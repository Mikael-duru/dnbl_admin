"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleArrowLeft, Eye, EyeOff } from "lucide-react";
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from "firebase/auth";

import { auth } from "@/firebase/firebase";
import AlertCard from "@/components/AlertCard";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import { Separator } from "@/components/ui/separator";

function ChangePassword() {
	const router = useRouter();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errMsg, setErrMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	// Validate Password
	const validatePassword = (password: any) => {
		if (password.length < 6) return "Password must be at least 6 characters";
		if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(password))
			return "Password must contain both letters and numbers";
		return "";
	};

	const handleCurrentPasswordChange = (e: any) => {
		setCurrentPassword(e.target.value);
	};

	const handleNewPasswordChange = (e: any) => {
		const password = e.target.value;
		setNewPassword(password);
		setErrors((prev) => ({
			...prev,
			newPassword: password
				? validatePassword(password)
				: "Password is required",
		}));
	};

	const handleConfirmPasswordChange = (e: any) => {
		const password = e.target.value;
		setConfirmPassword(password);
		setErrors((prev) => ({
			...prev,
			confirmPassword: password !== newPassword ? "Passwords do not match" : "",
		}));
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const newErrors = {
			currentPassword: currentPassword ? "" : "Current password is required",
			newPassword: validatePassword(newPassword),
			confirmPassword:
				confirmPassword === newPassword ? "" : "Passwords do not match",
		};

		setErrors(newErrors);

		if (
			!newErrors.currentPassword &&
			!newErrors.newPassword &&
			!newErrors.confirmPassword
		) {
			try {
				const user = auth.currentUser;

				if (user && user.email) {
					const credential = EmailAuthProvider.credential(
						user.email,
						currentPassword
					);
					await reauthenticateWithCredential(user, credential);
					await updatePassword(user, newPassword);
					setSuccessMsg("Password changed successfully!");
					setCurrentPassword("");
					setNewPassword("");
					setConfirmPassword("");
					router.push("/sign-in");
				} else {
					setErrMsg("No user is currently signed in.");
				}
			} catch (error) {
				setErrMsg(
					error instanceof Error ? error.message : "An unknown error occurred."
				);
			}
		}
	};

	const handleBack = () => {
		if (router && router.back) {
			router.back();
		}
	};

	return (
		<main className="py-10 px-[5%] xl:px-10 xl:pt-14 xl:pb-10">
			<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
				Settings
			</h2>
			<Separator className="bg-grey-1 mt-5 mb-10" />

			{/* Main content area */}
			<div className="w-3/4 max-lg:w-full bg-white dark:bg-[#2e2e2e] px-4 sm:px-6 rounded-[10px] py-14 shadow-custom">
				{/* Heading */}
				<div className="flex max-sm:flex-col sm:items-center gap-5 pb-6">
					<CircleArrowLeft
						size={40}
						className="cursor-pointer hover:text-[#B47B2B]"
						onClick={handleBack}
					/>
					<h2 className="font-open-sans font-semibold text-2xl leading-[33.6px] text-figure-text capitalize dark:text-white">
						Create new password
					</h2>
				</div>

				{/* Input fields */}
				<p className="text-[#667185] text-sm sm:text-base font-libre-franklin font-normal mb-10 dark:text-gray-300">
					Please! enter a new password. You will be logged out after changing
					your password.
				</p>

				<form onSubmit={handleSubmit}>
					<div className="max-w-[626px]">
						{/* Current Password */}
						<div className="mb-8">
							<label
								htmlFor="current-password"
								className="block text-sm md:text-base lg:text-lg font-medium text-gray-700 mb-1 dark:text-gray-300"
							>
								Current Password
							</label>
							<div className="relative">
								<input
									type={showCurrentPassword ? "text" : "password"}
									id="current-password"
									className={`w-full p-4 border ${
										errors.currentPassword ? "border-error" : "border-gray-300"
									} rounded-md text-[#101928] dark:text-white bg-white dark:bg-[#1E1E1E] placeholder:text-[#98A2B3] dark:placeholder:text-gray-400 text-[14px] leading-[20.3px] focus:outline-none focus:ring-1 focus:ring-[#B47B2B]`}
									placeholder="Enter your current password"
									value={currentPassword}
									onChange={handleCurrentPasswordChange}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-[18px] flex items-center"
									onClick={() => setShowCurrentPassword(!showCurrentPassword)}
								>
									{showCurrentPassword ? (
										<EyeOff className="text-gray-light w-5 h-5" />
									) : (
										<Eye className="text-gray-light w-5 h-5" />
									)}
								</button>
							</div>
							{errors.currentPassword && (
								<p className="mt-2 text-error text-sm">
									{errors.currentPassword}
								</p>
							)}
						</div>

						{/* New Password */}
						<div className="mb-8">
							<label
								htmlFor="new-password"
								className="block text-sm md:text-base lg:text-lg font-medium text-gray-700 mb-1 dark:text-gray-300"
							>
								New Password
							</label>
							<div className="relative">
								<input
									type={showNewPassword ? "text" : "password"}
									id="new-password"
									className={`w-full p-4 border ${
										errors.newPassword ? "border-error" : "border-gray-300"
									} rounded-md text-[#101928] dark:text-white bg-white dark:bg-[#1E1E1E] placeholder:text-[#98A2B3] dark:placeholder:text-gray-400 text-[14px] leading-[20.3px] focus:outline-none focus:ring-1 focus:ring-[#B47B2B]`}
									placeholder="Enter your new password"
									value={newPassword}
									onChange={handleNewPasswordChange}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-[18px] flex items-center"
									onClick={() => setShowNewPassword(!showNewPassword)}
								>
									{showNewPassword ? (
										<EyeOff className="text-gray-light w-5 h-5" />
									) : (
										<Eye className="text-gray-light w-5 h-5" />
									)}
								</button>
							</div>
							{errors.newPassword && (
								<p className="mt-2 text-error text-sm">{errors.newPassword}</p>
							)}
						</div>

						{/* Confirm New Password */}
						<div className="mb-10">
							<label
								htmlFor="confirm-password"
								className="block text-sm md:text-base lg:text-lg font-medium text-gray-700 mb-1 dark:text-gray-300"
							>
								Confirm New Password
							</label>
							<div className="relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									id="confirm-password"
									className={`w-full p-4 border ${
										errors.confirmPassword ? "border-error" : "border-gray-300"
									} rounded-md text-[#101928] dark:text-white bg-white dark:bg-[#1E1E1E] placeholder:text-[#98A2B3] dark:placeholder:text-gray-400 text-[14px] leading-[20.3px] focus:outline-none focus:ring-1 focus:ring-[#B47B2B]`}
									placeholder="Confirm your password"
									value={confirmPassword}
									onChange={handleConfirmPasswordChange}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-[18px] flex items-center"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? (
										<EyeOff className="text-gray-light w-5 h-5" />
									) : (
										<Eye className="text-gray-light w-5 h-5" />
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="mt-2 text-error text-sm">
									{errors.confirmPassword}
								</p>
							)}
						</div>

						{/* Error and Success Messages */}
						{errMsg && <AlertCard alert={errMsg} />}
						{successMsg && <AlertCard alert={errMsg} />}

						{/* Submit Button */}
						<div className="flex justify-center">
							<div className="w-[200px] sm:w-[350px]">
								<ButtonPrimary type="submit" label="Change Password" />
							</div>
						</div>
					</div>
				</form>
			</div>
		</main>
	);
}

export default ChangePassword;
