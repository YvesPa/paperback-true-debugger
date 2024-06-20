import {
    HomeSection,
    SearchRequest,
    PagedResults,
    Request,
    Response,
    SearchResultsProviding,
    ChapterProviding,
    MangaProviding,
    HomePageSectionsProviding,
    TagSection,
    Cookie,
    Chapter,
    ChapterDetails,
    SourceManga,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import { 
    AppHomeSection,
    ParseChapterDetails, 
    ParseChapters, 
    ParseHomeSection, 
    ParsePagedResults, 
    ParseQuery, 
    ParseSourceManga,
    ParseTagSections 
} from './DebugSourceParser'

export const DebugSourceInfo: SourceInfo = {
    version: '0.0.0',
    name: '',
    description: `Debuggings source`,
    author: 'YvesPa',
    authorWebsite: 'http://github.com/YvesPa',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: '',
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI
}

export abstract class DebugSource implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {
    abstract DEBUG_SERVER_URL : string;
    private readonly stateManager = App.createSourceStateManager()

    requestManager = App.createRequestManager({
        requestTimeout: 400000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                if (!request.url.startsWith(this.DEBUG_SERVER_URL)){
                    request.url = `${this.DEBUG_SERVER_URL}/getImage?imageUrl=${encodeURIComponent(request.url)}`
                }

                if (request.method === 'POST')
                {
                    request.data = {
                        request: request.data,
                        cookies: this.requestManager.cookieStore?.getAllCookies() ?? [],
                        states: await this.getAllStates(),
                        defaultUserAgent: await this.requestManager.getDefaultUserAgent()
                    }
                    request.headers = { 'Content-Type': 'application/json', ...request.headers }
                }
                return request
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                if (response.request.method === 'POST') {
                    const data = (JSON.parse(response.data as string))
                    // await this.setAllStates(data.states) dont use now
                    this.setAllCookies(data.cookies)
                }
                return response
            }
        }
    });

    async getAllStates(): Promise<Record<string, any>> {
        return {
            canvas_wanted: (await this.stateManager.retrieve('canvas_wanted') as boolean) ?? false
        } 
    }

    async setAllStates(states: Record<string, any>): Promise<void> {
        for (const key in states) {
            await this.stateManager.store(key, states[key]);
        }
    }

    setAllCookies(cookies: Cookie[]): void {
        const current = this.requestManager.cookieStore?.getAllCookies() ?? []
        for (const cookie of current) {
            this.requestManager.cookieStore?.removeCookie(cookie)
        }

        for (const cookie in cookies) {
            this.requestManager.cookieStore?.addCookie(cookies[cookie])
        }
    }

    async ExecRequest<T>(infos: { url: string, data?: any}): Promise<T>
    {
        const request = App.createRequest({ ...infos, method: 'POST'})
        const response = await this.requestManager.schedule(request, 0)
        const data = (JSON.parse(response.data as string)) 
        return data.result as T
    }

    async getSearchResults(query: SearchRequest, metadata: {page : number} | undefined): Promise<PagedResults> {
        var result = await this.ExecRequest<PagedResults> ({
            url: `${this.DEBUG_SERVER_URL}/getSearchResults`,
            data: { query: ParseQuery(query), metadata: metadata}
        })
        return ParsePagedResults(result)
    }

    /*
    async getSearchTags(): Promise<TagSection[]> {
        const result = await this.ExecRequest<TagSection[]>({ 
            url: `${this.DEBUG_SERVER_URL}/getSearchTags` 
        })
        return ParseTagSections(result)
    }
    */
    
    async getChapters(mangaId: string): Promise<Chapter[]> {
        const result = await this.ExecRequest<Chapter[]>({
            url: `${this.DEBUG_SERVER_URL}/getChapters`,
            data: { mangaId }
        })
        return ParseChapters(result);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const result = await this.ExecRequest<ChapterDetails>({
            url: `${this.DEBUG_SERVER_URL}/getChapterDetails`,
            data: { mangaId, chapterId }
        })
        return ParseChapterDetails(result);
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = await this.ExecRequest<AppHomeSection[]>({ 
            url: `${this.DEBUG_SERVER_URL}/getHomePageSections` 
        })

        for (const section of sections) {
            sectionCallback(ParseHomeSection(section))
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: {page: number} | undefined ): Promise<PagedResults> {
        const result = await this.ExecRequest<PagedResults>({
            url: `${this.DEBUG_SERVER_URL}/getViewMoreItems`,
            data: { homepageSectionId, metadata }
        })
        return ParsePagedResults(result)
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const result = await this.ExecRequest<SourceManga>({
            url: `${this.DEBUG_SERVER_URL}/getMangaDetails`,
            data: { mangaId }
        })
        return ParseSourceManga(result)
    }
}
