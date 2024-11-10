import ShadowBox from "./ShadowBox";
import "./css/Home.css";
import fakePng from "./fake.png";
import {DashboardBar, DashboardBox, DashboardWidget} from "./Dashboard";

function Home() {
    return (
        <div>


            <table className={"HomeTable"}>
                <tbody>
                <tr>
                    <td colSpan={2}>
                        <img src={fakePng} alt={""} />
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <DashboardBar>
                            <DashboardWidget label={"Users"} numeric={25} />
                            <DashboardWidget label={"Employers"} numeric={"1,443"} />
                            <DashboardWidget label={"Jobs"} numeric={0} />
                            <DashboardWidget label={"Messages"} numeric={"-"} loading={true} />
                        </DashboardBar>
                    </td>
                </tr>
                <tr>
                    <td>
                        <ShadowBox>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lobortis tempor mauris, sit amet efficitur magna. Aliquam vitae tellus sit amet orci fermentum dapibus at vitae tellus. Curabitur quis viverra tellus, et venenatis urna.
                            </p>
                            <p>
                            Praesent diam purus, laoreet eget porta ut, iaculis quis orci. Proin mauris magna, vehicula a semper eu, porttitor nec justo. Phasellus non leo quis sem vulputate semper eget sed turpis. Vivamus pulvinar tristique fringilla. Sed ultricies libero in dui molestie consectetur. Suspendisse nec scelerisque libero, non vulputate felis.
                            </p>
                        </ShadowBox>
                    </td>
                    <td>
                        <ShadowBox>
                            <p>
                                Praesent elementum turpis eget orci condimentum finibus. Ut porta facilisis tellus. Duis
                                diam dui, malesuada et nisi id, egestas pulvinar orci. Phasellus et feugiat lectus, ac
                                eleifend neque.
                            </p>
                        </ShadowBox>
                        <ShadowBox>
                            <p>
                                Duis sollicitudin, nisi non consequat convallis, leo sem facilisis sapien, quis laoreet orci massa non lacus. Cras ligula turpis, ultrices eget nulla sit amet, volutpat aliquet metus.
                            </p>
                            <p>
                                Phasellus et feugiat lectus, ac
                                eleifend neque.
                            </p>
                        </ShadowBox>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Home;

// EOF