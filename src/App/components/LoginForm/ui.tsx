import * as React from "react";
import "./index.css";
import {UserService} from "../../services/UserService";
import {Form, Button} from "semantic-ui-react";
import {LoginRequest} from "../../models/LoginRequest";
import {LoginResponse} from "../../models/LoginResponse";

export default class LoginForm extends React.Component<
    { setLogginState: (status: boolean) => void; },
    {
        loading: boolean;
        isError: boolean;
        UserInput: LoginRequest;
        errorMessage: String;
    }>
{

    private userService: UserService = new UserService();

    public state = {
        loading: false,
        UserInput: {id: 0, email: '', username: '', password: ''},
        isError: false,
        errorMessage: " "

    };

    public render(): React.ReactNode {
        return (
            <main>
                {this.state.isError ? this.state.errorMessage : " "}
                {this.renderLoginForm()}
            </main>
        );
    }

    private renderLoginForm() {
        return (
            <Form>
                <Form.Field>
                    <label>Username:</label>
                    <input placeholder='Username'
                           value={this.state.UserInput.username}
                           onChange={this.captureUsernameInput.bind(this)}/>
                </Form.Field>
                <Form.Field>
                    <label>Password:</label>
                    <input placeholder='Password'
                           value={this.state.UserInput.password}
                           onChange={this.capturePasswordInput.bind(this)}/>
                </Form.Field>
                <Button className={`primary ui button ${this.state.loading ? 'loading' : ''}`}
                        type='submit'
                        onClick={() => this.authenticate(this.state.UserInput)}>
                    Submit
                </Button>
            </Form>

        );
    }

    private captureUsernameInput(event) {
        // this.props or this.state -> bind
        const input = this.state.UserInput;
        input.username = event.target.value;
        this.setState({UserInput: input})
    }

    /**
     *
     * @param event
     */
    private capturePasswordInput(event) {
        // this.props or this.state -> bind
        const input = this.state.UserInput;
        input.password = event.target.value;
        this.setState({UserInput: input})
    }

    /**
     *
     * @param userToAdd
     */

    private authenticate (userToAuthenticate: LoginRequest)
    {
        this.userService.loginUser(userToAuthenticate)
            .subscribe((loginReponse: LoginResponse) => this.handleSuccessResponse(loginReponse),
                (error:any) => this.handleErrorResponse(error)
            );
    }

    private handleErrorResponse(error: any)
    {

        // updating local state
        // this.setState({isError: true, errorMessage: error.response.data.message});
        console.log(error.response);

        // update state in main APP
        this.props.setLogginState(false);

    }

    private handleSuccessResponse(loginResponse: LoginResponse)
    {
        this.setState({isError: false});
        localStorage.setItem("authToken", loginResponse.authToken);
        this.props.setLogginState(true);
        // this.props.history.push('/');

    }


    /*private saveNewUser(userToAdd: User) {
        // if already loading, then return - don't do anything
        if (this.state.loading) {
            return;
        }

        // set in loading state
        this.setState({loading: true});

        // make http request
        this.userService
            .addUser(this.state.newUser)
            .subscribe((savedUser: User) => this.onUserSaved(savedUser));
    }

    private onUserSaved(savedUser: User) {
        this.setState({
            loading: false,
            newUser: {id: 0, username: '', password: '', email: ''}
        });
        this.props.history.push('/');
    }*/

}