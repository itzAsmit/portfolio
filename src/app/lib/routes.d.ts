export type ProjectId = 'ghostview' | 'bot' | 'esport'

export type Route =
  | { page: 'home'; anchor?: string }
  | { page: 'work' }
  | { page: 'about' }
  | { page: 'project'; id: ProjectId; film?: true }

export declare const projectIds: ProjectId[]
export declare function parseRoute(hash: string): Route
export declare function routeKey(route: Route): string
export declare function routeTitle(route: Route, names?: Record<string, string>): string
