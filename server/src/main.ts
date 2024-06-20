import { PaperBackDebugServer } from "./Server/Server";

// HERE : Choose your hostname and port
const hostname = 'http://192.168.1.150'
const port = 8042;

// HERE : Change / Add your instance of the source
import { MangaPlus } from './Source/MangaPlus';
const source = new MangaPlus();

new PaperBackDebugServer(hostname, port, source);