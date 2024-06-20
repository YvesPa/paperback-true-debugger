import { 
    Chapter, 
    ChapterDetails, 
    HomeSection, 
    MangaInfo,
    PagedResults, 
    PartialSourceManga, 
    SearchRequest, 
    SourceManga, 
    Tag, 
    TagSection 
} from "@paperback/types"

export type AppHomeSection = HomeSection & {type : string}

const _string = (str: string) => str === 'undefined' ? undefined : str
const _number = (num: number) => num === -1042 ? undefined : num
const _date = (date: Date) => new Date(date)

export const ParseChapters = (chapters: Chapter[]) => 
    chapters.map(chapter => 
        App.createChapter(ParseChapter(chapter)))

export const ParseChapter = (chapter: Chapter) =>
    App.createChapter({
        id: chapter.id,
        chapNum: chapter.chapNum,
        volume: _number(chapter.volume),
        name:  _string(chapter.name),
        group: _string(chapter.group),
        time: _date(chapter.time),
        langCode: _string(chapter.langCode),
        sortingIndex: _number(chapter.sortingIndex)
    })    

export const ParseChapterDetails = (chapterDetail: ChapterDetails) =>
    App.createChapterDetails(chapterDetail)

export const ParseSourceManga = (sourceManga: SourceManga) =>
    App.createSourceManga({
        id: sourceManga.id,
        mangaInfo: ParseMangaInfo(sourceManga.mangaInfo)
    })

export const ParseMangaInfo = (mangaInfo: MangaInfo) => 
    App.createMangaInfo({
        image: mangaInfo.image,
        artist: _string(mangaInfo.artist),
        author: _string(mangaInfo.author),
        desc: mangaInfo.desc,
        status: mangaInfo.status,
        hentai: mangaInfo.hentai,
        titles: mangaInfo.titles,
        banner: mangaInfo.banner,
        rating: mangaInfo.rating,
        tags: ParseTagSections(mangaInfo.tags),
        covers: mangaInfo.covers,
        additionalInfo: undefined
    })

export const ParseTagSections = (tagSections: TagSection[]) =>
    tagSections.map(tagSection => 
        ParseTagSection(tagSection))    

export const ParseTagSection = (tagSection: TagSection) =>
    App.createTagSection({
        id: tagSection.id,
        label: tagSection.label,
        tags: tagSection.tags.map(tag => 
            ParseTag(tag))
    })

export const ParseTag = (tag: Tag) =>
    App.createTag({
        id: tag.id,
        label: tag.label
    })

export const ParsePagedResults = (pagedResults: PagedResults) =>
    App.createPagedResults({
        results: ParsePartialSourceMangas(pagedResults.results),
        metadata: pagedResults.metadata
    })

export const ParsePartialSourceMangas = (partialSourceMangas: PartialSourceManga[]) =>
    partialSourceMangas.map(partialSourceManga => 
        ParsePartialSourceManga(partialSourceManga))

export const ParsePartialSourceManga = (partialSourceManga: PartialSourceManga) =>
    App.createPartialSourceManga(partialSourceManga)

export const ParseQuery = (query: SearchRequest) => ({
    title : query.title,
    includedTags : query.includedTags,
    excludedTags : query.excludedTags,
    includeOperator : query.includeOperator,
    excludeOperator : query.excludeOperator,
    parameters : query.parameters
})

export const ParseHomeSection = (homeSection: AppHomeSection) =>
    App.createHomeSection({
        id: homeSection.id,
        title: homeSection.title,
        type: homeSection.type,
        items: ParsePartialSourceMangas(homeSection.items),
        containsMoreItems: homeSection.containsMoreItems
    })
