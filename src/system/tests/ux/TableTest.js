import React, { Component } from "react";
import "./TableTest.css";

class TableTest extends Component {
    render() {
        return (
            <div>
                <h2>Table Test</h2>

                <table className={"FancyTable"}>
                    <thead>
                    <tr>
                        <th>Index</th>
                        <th>Name</th>
                        <th>Color</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1.</td>
                        <td>sda</td>
                        <td>Cofsdaafsdsfdfsdlor</td>
                        <td>Actiffsdafsdons</td>
                    </tr>
                    <tr>
                        <td>21.</td>
                        <td>as</td>
                        <td>Cofsdaafsdsfdfsdlor</td>
                        <td>Actiffsdafsdons</td>
                    </tr>
                    <tr>
                        <td>1.</td>
                        <td>asd</td>
                        <td>Cofsdaafsdsfdfsdlor</td>
                        <td>Actiffsdafsdons</td>
                    </tr>
                    <tr>
                        <td>1.</td>
                        <td>asdas</td>
                        <td>Cofsdaafsdsfdfsdlor</td>
                        <td>Actiffsdafsdons</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={4}>
                            asasdasdas
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
}

export default TableTest;

// EOF