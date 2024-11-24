import { render, screen, within } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event'

test('Renders App checks login view', () => {
	render(<App />);
	const loginTab = screen.getByRole("tab", {name:"Login"});
	expect(loginTab).toBeInTheDocument();
	const tabPanel = screen.getByRole("tabpanel", {name: "Login"});
	expect(tabPanel).toBeInTheDocument();
	expect(within(tabPanel).getByTestId("login-username")).toBeInTheDocument();
	expect(within(tabPanel).getByTestId("login-password")).toBeInTheDocument();
});

test('Renders App checks login without any details', () => {
	render(<App />);
	const loginTab = screen.getByRole("tab", {name:"Login"});
	expect(loginTab).toBeInTheDocument();
	const tabPanel = screen.getByRole("tabpanel", {name: "Login"});
	expect(tabPanel).toBeInTheDocument();
	userEvent.click(within(tabPanel).getByRole("button",{name: "Login"}));
	expect(tabPanel).toBeInTheDocument();
});

test("Renders App and checks register view", async () =>{
	render(<App />);
	const signUpTab = screen.getByRole("tab", { name: "Signup" });
	expect(signUpTab).toBeInTheDocument();
	await userEvent.click(signUpTab);
	const tabPanel = await screen.findByRole("tabpanel", {name: "Signup"})
	expect(within(tabPanel).getByTestId("signup-name")).toBeInTheDocument();
	expect(within(tabPanel).getByTestId("signup-username")).toBeInTheDocument();
	expect(within(tabPanel).getByTestId("signup-password")).toBeInTheDocument();
})
