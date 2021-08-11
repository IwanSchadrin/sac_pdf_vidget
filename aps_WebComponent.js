(function () {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<fieldset>
				<legend>PDF Widget Settings</legend>
				<table>
					<tr>
						<td>PDF URL</td>
						<td><input id="pdfUrl" type="string"></td>
					</tr>
					<tr>
						<td>Pop-Up Title</td>						
						<td><textarea id="popupTitle" rows="5" cols="33"></td>
					</tr>
				</table>
			</fieldset>
		</form>
	`;

	//<td><input id="popupTitle" type="string"></td>
	class PDFViewerAps extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({ mode: "open" });
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
				detail: {
					properties: {
						pdfUrl: this.pdfUrl,
						popupTitle: this.popupTitle
					}
				}
			}));
		}

		set pdfUrl(newPdfUrl) {
			this._shadowRoot.getElementById("pdfUrl").value = newPdfUrl;
		}

		get pdfUrl() {
			return this._shadowRoot.getElementById("pdfUrl").value;
		}

		set popupTitle(newPopupTitle) {
			this._shadowRoot.getElementById("popupTitle").value = newPopupTitle;
		}

		get popupTitle() {
			return this._shadowRoot.getElementById("popupTitle").value;
		}
	}

	customElements.define("com-openpromos-sac-pdf-vidget-aps", PDFViewerAps);
})();
