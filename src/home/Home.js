import ShadowBox from "./ShadowBox";
import "./css/Home.css";
import fakePng from "./fake.png";

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
                    <td>
                        <ShadowBox>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lobortis tempor mauris, sit amet efficitur magna. Aliquam vitae tellus sit amet orci fermentum dapibus at vitae tellus. Curabitur quis viverra tellus, et venenatis urna. In neque nisi, feugiat at diam quis, dapibus consequat eros. Etiam et tortor nisl. Mauris commodo augue eu diam molestie, nec cursus elit malesuada. Sed vitae nisi eu elit convallis rutrum. Ut cursus nibh nec volutpat varius. Sed finibus lacus quam, et elementum ipsum condimentum sit amet. Pellentesque at ultrices diam, id euismod tellus. Suspendisse pretium, erat nec consectetur tincidunt, sapien nunc luctus erat, eu egestas ipsum tellus non velit. Aliquam commodo dui auctor lacus egestas, in lacinia eros scelerisque. Vivamus maximus at libero non lacinia.
                            </p>
                            <p>
                            Praesent diam purus, laoreet eget porta ut, iaculis quis orci. Proin mauris magna, vehicula a semper eu, porttitor nec justo. Phasellus non leo quis sem vulputate semper eget sed turpis. Vivamus pulvinar tristique fringilla. Sed ultricies libero in dui molestie consectetur. Suspendisse nec scelerisque libero, non vulputate felis. Aliquam a lectus et augue sodales consequat. Suspendisse pulvinar, metus ut rhoncus congue, massa libero interdum massa, vel condimentum nunc eros at ante. Suspendisse facilisis enim nec bibendum pharetra. Aenean fringilla, velit eu luctus dapibus, dolor mauris malesuada mauris, a tincidunt dui ipsum eu est. Phasellus dictum sagittis tortor, in rutrum diam molestie at.
                            </p>
                        </ShadowBox>
                    </td>
                    <td>
                        <ShadowBox>
                            <p>
                                Praesent elementum turpis eget orci condimentum finibus. Ut porta facilisis tellus. Duis
                                diam dui, malesuada et nisi id, egestas pulvinar orci. Phasellus et feugiat lectus, ac
                                eleifend neque. Phasellus dapibus commodo interdum. Nam sed varius felis, eget luctus
                                velit. Quisque dignissim at lacus in rhoncus. Phasellus consequat ut urna in eleifend.
                                Vivamus pretium ligula eu velit sollicitudin vestibulum.
                            </p>
                        </ShadowBox>
                        <ShadowBox>
                            Duis sollicitudin, nisi non consequat convallis, leo sem facilisis sapien, quis laoreet orci massa non lacus. Cras ligula turpis, ultrices eget nulla sit amet, volutpat aliquet metus. Sed vehicula quam ac finibus venenatis. Praesent aliquam ultricies magna. Duis sit amet ligula urna. In fringilla nulla quis ex ultrices pharetra. Phasellus aliquet urna sapien, vitae posuere ligula ullamcorper in. Mauris placerat, ex ut egestas venenatis, ex lectus vehicula leo, sed mollis nisi mi eu felis. Donec eget ultrices ipsum, a facilisis justo. Nam ultricies, risus a sagittis mollis, orci dui faucibus lorem, ac aliquet ante ante ut augue. Curabitur sit amet ornare velit. Cras porta malesuada nibh, et aliquam dolor molestie non. Vivamus eleifend nisl id ligula pulvinar placerat. Nam egestas quam ut mauris vehicula, gravida blandit est fermentum. Nulla posuere vulputate est, ac pharetra nisi pulvinar eget. Etiam sit amet feugiat ex.
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