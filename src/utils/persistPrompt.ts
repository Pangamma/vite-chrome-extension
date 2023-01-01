

export async function persistPromptAsync(title: string, text: string): Promise<string> {
    let promptPromiseResolveFunc = undefined;
    let promptPromiseRejectFunc = undefined;
    return new Promise((resolve, reject) => {
        promptPromiseRejectFunc = (error: unknown) => reject(error);
        promptPromiseResolveFunc = (result: string) => {
            const elemW = document.getElementsByClassName('c-persistPrompt-wrapper').item(0) as HTMLDivElement;
            elemW.style.display = 'none';
            resolve(result);
        };

        let elem = document.getElementsByClassName('c-persistPrompt-wrapper').item(0) as HTMLDivElement;
        if (elem === undefined || elem === null) {
            const styleElem = document.createElement('style');
            styleElem.innerHTML = `
            .c-persistPrompt-wrapper {
                position: absolute;
                top: 0; right: 0; left: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                z-index: 19;
            }

            .c-persistPrompt {
                position: relative;
                z-index: 20;
                max-width: 500px;
                width: 500px;
                max-height: 500px;
                min-height: 200px;
                margin: auto;
                margin-top: 20px;
                background: white;
                box-shadow: 0 6px 6px rgb(0 0 0 / 10%);
                border: 1px solid #007be8;
            }
            .c-persistPrompt > .cc-title {
                background: #007be8;
                color: white;
                padding: 10px 5px;
                font-size: 24px;
            }
            .c-persistPrompt > .cc-body {
                padding: 10px; 5px;
            }
            .c-persistPrompt > .cc-body input {
                max-width: 100%;
            }
            `;
            document.head.appendChild(styleElem);

            elem = document.createElement('div') as HTMLDivElement;
            elem.className = 'c-persistPrompt-wrapper';
            elem.style.display = 'none';
            elem.innerHTML = `
            <div class="c-persistPrompt">
                <div class="cc-title">
                    Information Needed
                </div>
                <div class="cc-body">
                    <p>
                        <label for="tbxPersistPromptText" id="lblPersistPromptText">Prompt Text:</label><br/>
                        <input type="text" name="tbxPersistPromptText" id="tbxPersistPromptText"></input>
                    </p>
                    <button type="button" id="btnPersistPromptNext">Next</button>
                </div>
            </div>
            `;

            document.body.appendChild(elem);
        }

        elem.querySelector<HTMLDivElement>('.cc-title').textContent = title || 'Info needed';
        elem.querySelector<HTMLInputElement>('#lblPersistPromptText').textContent = (text || 'Question to answer') + ': ';
        elem.querySelector<HTMLButtonElement>('#btnPersistPromptNext').onclick = () => {
            const inputVal = document.querySelector<HTMLInputElement>('#tbxPersistPromptText').value;
            document.querySelector<HTMLInputElement>('#tbxPersistPromptText').value = '';
            promptPromiseResolveFunc(inputVal);
        };
        
        elem.style.display = 'block';
    });
}

