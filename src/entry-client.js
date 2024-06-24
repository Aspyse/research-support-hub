/* This file is run by the client when
 * the browser loads index.html
 */

import './style.css'
import './javascript.svg'
import { setupCounter } from './counter'

setupCounter(document.querySelector('#counter'))
