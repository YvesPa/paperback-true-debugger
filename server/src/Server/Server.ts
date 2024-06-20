import '../App/App';
import { HomeSection, SearchRequest } from '@paperback/types';
import { AppHomeSection } from '../App/AppHomeSection';
import { AppSource } from '../App/App';
import express, { Request, Response, Express } from 'express';

export class PaperBackDebugServer {
    private server!: Express;
    private source: AppSource;

    constructor(hostname: string, port: number, source: AppSource){
        App.setHostName(`${hostname}:${port}`);
        this.source = source;

        this.server = express();
        this.server.use(express.json());
        this.addMiddleware();
        this.addRoutes();

        this.server.listen(port, () => {
            console.log(`Server is running on ${hostname}:${port}`);
        });
    }

    addMiddleware(){
        this.server.use(function(req, res, next) {
            const { cookies, states, request, defaultUserAgent } = req.body;
            req.body = request;
        
            App.setAllCookies(cookies);
            App.setAllStates(states);
            App.setDefaultUserAgent(defaultUserAgent);
        
            const originalJson = res.json
            res.json = function (data) {
                return originalJson.call(this, 
                    {
                        result: data,
                        cookies: App.getAllCookies(),
                        states: App.getAllStates()
                    }
                )
            }
        
            next();
        });
    }

    addRoutes(){
        this.addPost('/getSearchResults', async (req, res) => {
            if (this.source.getSearchResults === undefined)
                return res.status(405).send('Not implemented');
        
            const query = req.body.query as SearchRequest
            const result = await this.source.getSearchResults(query, req.body.metadata);
            res.status(200).json(result);
        });
        
        this.addPost('/getSearchTags', async (_, res) => {
            if (this.source.getSearchTags === undefined)
                return res.status(405).send('Not implemented');
        
            const result = await this.source.getSearchTags();
            res.status(200).json(result);
        });
        
        this.addPost('/getChapters', async (req, res) => {
            if (this.source.getChapters === undefined)
                return res.status(405).send('Not implemented');
        
            const mangaId = req.body.mangaId as string;
            const result = await this.source.getChapters(mangaId);
            res.status(200).json(result);
        });
        
        this.addPost('/getChapterDetails', async (req, res) => {
            if (this.source.getChapterDetails === undefined)
                return res.status(405).send('Not implemented');
        
            const mangaId = req.body.mangaId as string;
            const chapterId = req.body.chapterId as string;
            const result = await this.source.getChapterDetails(mangaId, chapterId);
            res.status(200).json(result);
        });
        
        this.addPost('/getHomePageSections', async (_, res) => {
            if (this.source.getHomePageSections === undefined)
                return res.status(405).send('Not implemented');
        
            const results : HomeSection[] = []
            await this.source.getHomePageSections((section: HomeSection) => {
                results.push(section as AppHomeSection);
            });
            res.status(200).json(results);
        })
        
        this.addPost('/getViewMoreItems', async (req, res) => {
            if (this.source.getViewMoreItems === undefined)
                return res.status(405).send('Not implemented');
        
            const homepageSectionId = req.body.homepageSectionId as string;
            const result = await this.source.getViewMoreItems(homepageSectionId, req.body.metadata);
            res.status(200).json(result);
        });
        
        this.addPost('/getMangaDetails', async (req, res) => {
            if (this.source.getMangaDetails === undefined)
                return res.status(405).send('Not implemented');
        
            const mangaId = req.body.mangaId as string;
            const result = await this.source.getMangaDetails(mangaId);
            res.status(200).json(result);
        });
        
        this.addGet('/getImage', async (req, res) => {
            const imageUrl = req.query.imageUrl as string;
            const request = App.createRequest({url: imageUrl, method: 'GET'});
            const result = await App.getRequestManager()?.schedule(request, 1);
        
            if (result && result.rawData)
            {
                for (const header in result?.headers) {
                    res.setHeader(header, result?.headers[header]);
                }
        
                res.status(result.status).send(result.rawData);
            }else{
                res.status(404).send('Not found');
            }
        });
    }

    addPost(path: string, callback: (req: Request, res: Response) => Promise<unknown>)
    {
        this.server.post(path, ErrorHandler(callback));
    }

    addGet(path: string, callback: (req: Request, res: Response) => Promise<unknown>)
    {
        this.server.get(path, ErrorHandler(callback));
    }
}

function ErrorHandler(fonction: (a:Request,b: Response) => Promise<unknown>){
    return (a:Request,b: Response) => {
        fonction(a,b).catch(error =>
        {
            console.error(error);
            b.status(500).send('Internal server error : ' + error.message);
        })
    }
}
