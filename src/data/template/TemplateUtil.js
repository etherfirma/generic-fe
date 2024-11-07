import Server from "../../util/Server";

const templateLink = (template) => {
    return (
        <span onClick={() => window.location.hash = `#/data/template/${template.id}`}>
            <i className="fal fa-browser"></i>
            &nbsp;
            {template.path}
        </span>
    )
};

class TemplateUtil {

}

export default new TemplateUtil ();

export {
    templateLink
};

// EOF