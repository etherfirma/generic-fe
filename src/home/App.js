import './App.css';
import '../global/css/Global.css';
import AuthManager from '../util/AuthManager';
import LOGGED_IN from "./LoggedInRoutes";
import ANONYMOUS from "./AnonymousRoutes";
import {RouterProvider} from "react-router";
import {Component} from "react";
import {observer} from "mobx-react";
import Sidebar from "../global/Sidebar";
import Header from "../global/Header";
import Footer from "../global/Footer";

function renderLoggedIn () {
    return (
        <div className={"OuterWrapper"}>
            <Header/>
            <div className={"InnerWrapper"}>
                <Sidebar/>
                <div className={"ContentPane"}>
                    <RouterProvider router={LOGGED_IN}/>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

function renderAnonymous() {
    return (
        <div>
            <RouterProvider router={ANONYMOUS}/>
        </div>
    );
}

class App extends Component {
    render() {
        if (AuthManager.isLoggedIn) {
            return renderLoggedIn()
        } else {
            return renderAnonymous()
        }
    }
}

export default observer (App);

// EOF