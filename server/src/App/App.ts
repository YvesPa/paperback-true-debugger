// tachi.ts
import { 
    Chapter, 
    Cookie, 
    PartialSourceManga, 
    TagSection, 
    Tag, 
    MangaUpdates,
    SourceInterceptor,
    SearchField,
    SourceManga,
    SearchResultsProviding,
    MangaProviding,
    ChapterProviding,
    HomePageSectionsProviding,
    CloudflareBypassRequestProviding,
    MangaProgressProviding,
    RequestManagerProviding
} from '@paperback/types';

import './AppMore';
import { UselessAppFunction } from './AppUselessDtos';
import { AppRequestManager } from './AppRequestManager';
import { AppSourceStateManager } from './AppSourceStateManager';
import { AppHomeSection } from './AppHomeSection';
import { AppSourceCookieStore } from './AppSourceCookieStore';

// Serveur side App instances 
const APP_sourceStateManager = new AppSourceStateManager();
const APP_sourceCookieStore = new AppSourceCookieStore();
const APP_requestManager : { rq: AppRequestManager | undefined } = { rq: undefined } 
let APP_hostName: string|undefined = undefined

export type AppSource = Partial<ChapterProviding 
                                & CloudflareBypassRequestProviding 
                                & HomePageSectionsProviding 
                                & MangaProgressProviding 
                                & MangaProviding 
                                & RequestManagerProviding 
                                & SearchResultsProviding>

// Constants for default null values in the App that need to be set and nullyfied in paperbacksource
const _string = 'undefined'
const _number = -1042

globalThis.App = {
    createSourceStateManager: () => APP_sourceStateManager,
    
    createChapter: (info: {id: string, chapNum: number, volume?: number, name?: string, group?: string, time?: Date, langCode?: string, sortingIndex?: number}) : Chapter => ({
        volume: info.volume ?? _number, 
        name: info.name ?? _string, 
        group: info.group ?? _string, 
        time: info.time ?? new Date(), 
        langCode: info.langCode ?? _string, 
        sortingIndex: info.sortingIndex ?? _number,
        ...info
    }),
    createChapterDetails: (info: {id: string, mangaId: string, pages: string[]}) => ({
        id: info.id,
        mangaId: info.mangaId,
        pages: info.pages
    }),
    createCookie: (cookie : Cookie) => cookie,
    createHomeSection: (info: { id: string, title: string, type: string, items?: PartialSourceManga[], containsMoreItems: boolean }) => new AppHomeSection(info),
    createMangaInfo: (info: {image: string, artist?: string, author?: string, desc: string, status: string, hentai?: boolean, titles: string[], banner?: string, rating?: number, tags?: TagSection[], covers?: string[], additionalInfo?: Record<string, string>, }) => ({
        image: info.image,
        artist: info.artist ?? _string,
        author: info.author ?? _string,
        desc: info.desc,
        status: info.status,
        hentai: info.hentai ?? false,
        titles: info.titles,
        banner: info.banner,
        rating: info.rating,
        tags: info.tags ?? [],
        covers: info.covers ?? [],
        avgRating: _number,
        follows: _number,
        langFlag: _string,
        langName: _string,
        users: _number,
        views: _number
    }),
    createMangaProgress: (info: {mangaId: string, lastReadChapterNumber: number, lastReadVolumeNumber?: number, trackedListName?: string, lastReadTime?: Date, userRating?: number}) => ({
        sourceId: _string,
         ...info
    }),
    createMangaUpdates: (mangaUpdates: MangaUpdates) => mangaUpdates,
    createPagedResults: (info: {results?: PartialSourceManga[], metadata?: any}) => ({
        results: info.results ?? [], 
        ...info
    }),
    createPartialSourceManga: (partialSourceManga : PartialSourceManga) => partialSourceManga,
    createTagSection: (tagSection: TagSection) => tagSection,
    createTag: (tag:Tag) => tag,

    createRequest: (info: {url: string, method: string, headers?: Record<string, string>, param?: string, data?: any, cookies?: Cookie[]}) => ({
        headers: info.headers ?? {},
        cookies: info.cookies ?? [],
        ...info
    }),
    createRequestManager: (info: {interceptor?: SourceInterceptor, requestsPerSecond?: number, requestTimeout?: number}) => {
        APP_requestManager.rq = new AppRequestManager(info, APP_sourceCookieStore)
        return APP_requestManager.rq
    },
    
    createSearchField: (searchField: SearchField) => searchField,
    createSourceManga: (sourceManga: SourceManga) => sourceManga,

    setAllCookies: (cookies: Cookie[]) => APP_sourceCookieStore.setAllCookies(cookies),
    getAllCookies: () => APP_sourceCookieStore.getAllCookies(),

    setAllStates: (states: Record<string, any>) => APP_sourceStateManager.setAllStates(states),
    getAllStates: (): Record<string, any> => APP_sourceStateManager.getAllStates(),

    getRequestManager: () => APP_requestManager.rq,
    setDefaultUserAgent: (userAgent: string) => APP_requestManager.rq?.setDefaultUserAgent(userAgent),

    setHostName: (hostName: string) => APP_hostName = hostName,
    getHostName: () => APP_hostName,

    ...UselessAppFunction
};
