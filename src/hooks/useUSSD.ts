import { useState } from "react";
import axios from "axios";

const XMLParser = require('react-xml-parser');

const networks = [
    { id: '1', name: 'AirtelTigo' },
    { id: '3', name: 'Glo' },
    { id: '6', name: 'Vodafone' },
    { id: '4', name: 'MTN' },
];

const { REACT_APP_USSD_ENDPOINT } = process.env;
function nl2br(s: string) { return s.split(/\r?\n/).join("<br>"); }
const useUSSD = () => {
    const [endpoint, setEndpoint] = useState<string>(REACT_APP_USSD_ENDPOINT || '');
    const [network, setNetwork] = useState('4');
    const [sessionid, setSessionId] = useState((new Date()).getTime());
    const [msisdn, setMsisdn] = useState<string>('233244552821');
    const [ussdinput, setUssdInput] = useState<string>('1');
    const [screen, setScreen] = useState<string>('');
    const [responseType, setResponseType] = useState<string>('');

    const handleSubmit = (e: any) => {
        if (e) e.preventDefault();
        const body = {
            pryussd_req: {
                msisdn,
                ussdinput,
                network,
                sessionid: sessionid.toString(),
            }
        }
        axios.post(endpoint, body)
            .then(resp => {
                const { data } = resp;
                const dataCleaned = nl2br(data);
                const regex = /<ussdmsg>(.*?)<\/ussdmsg>/g;
                const replaceRegex = /<ussdmsg>|<\/ussdmsg>/g
                const found = dataCleaned.match(regex);
                const ussdmsg = found ? found[0].replaceAll(replaceRegex, '') : '';
                const xml = new XMLParser().parseFromString(data);
                const resptype = xml?.children?.find(({ name }: { name: string }) => name === 'resptype')?.value;
                setScreen(ussdmsg);
                setResponseType(resptype);
            })
            .catch(e => {
                alert(e.message)
            });
    };

    const handleOkClick = () => {
        if (responseType.toLowerCase() !== 'continue') {
            resetSession();
            setUssdInput('1');
        }
        handleSubmit(null);
        return;
    }

    const resetSession = () => {
        setSessionId((new Date()).getTime());
        setUssdInput('1');
        setScreen('');
    }

    return {
        handleSubmit,
        endpoint,
        setEndpoint,
        networks,
        network,
        setNetwork,
        msisdn,
        setMsisdn,
        screen,
        ussdinput,
        setUssdInput,
        handleOkClick,
        resetSession,
        responseType,
    }
}

export default useUSSD;