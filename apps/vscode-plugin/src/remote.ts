export type EmptyOptions = Record<never, never>;

export type RemoteActions = {
  drawerClose(options: EmptyOptions): Promise<void>;
  informationShow(options: { message: string }): Promise<void>;
  statusSet(options: { value: string }): Promise<void>;
  colorSet(options: { value: string }): Promise<void>;
};

export type RemoteObj = {
  status: string;
  color: string;
  actions: RemoteActions;
};
