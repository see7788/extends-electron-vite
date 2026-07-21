import type { StateCreator } from "zustand";
import type { CommentNode, DouyinDetailContext, DouyinDetailPubSub } from "./types";

type TransportContext = Pick<DouyinDetailContext, "read">;
type SetRoot = (recipe: (state: UserAppRootState) => void) => void;
type GetRoot = () => UserAppRootState;

type DouyinDetailSectionActions = {
  state: {
    connect(topicId: string): () => void;
  };
  errorText: {
    set(errorText: string): void;
    clear(): void;
  };
  comment: {
    draftSet(content: string): void;
    draftAppend(content: string): void;
    send(): Promise<void>;
    reply(): Promise<void>;
    select(commentId: string): void;
    clearSelection(): void;
  };
};

export type DouyinDetailStoreShape = {
  topicId: string;
  connectionId: string;
  isConnected: boolean;
  isSending: boolean;
  draftText: string;
  selectedCommentId: string;
  comments: CommentNode[];
  errorText: string;
  actions: DouyinDetailSectionActions;
};

type UserAppRootState = {
  douyinDetail: DouyinDetailStoreShape;
};

export default (context: TransportContext): StateCreator<UserAppRootState> => {
  return (set, get) => {
    const setRoot = set as SetRoot;
    const getRoot = get as GetRoot;

    class DouyinDetailStore {
      topicId = "";
      connectionId = "";
      isConnected = false;
      isSending = false;
      draftText = "";
      selectedCommentId = "";
      comments: CommentNode[] = [];
      errorText = "";

      private offConnected: (() => void) | undefined;
      private offSnapshot: (() => void) | undefined;
      private offAdded: (() => void) | undefined;
      private offError: (() => void) | undefined;

      private readonly actions: DouyinDetailSectionActions = {
        state: {
          connect: this.connect.bind(this),
        },
        errorText: {
          set: this.errorTextSet.bind(this),
          clear: this.errorTextClear.bind(this),
        },
        comment: {
          draftSet: this.draftSet.bind(this),
          draftAppend: this.draftAppend.bind(this),
          send: this.send.bind(this),
          reply: this.reply.bind(this),
          select: this.select.bind(this),
          clearSelection: this.clearSelection.bind(this),
        },
      };

      constructor(
        private readonly transportContext: TransportContext,
        private readonly setState: SetRoot,
        private readonly getState: GetRoot,
      ) {}

      private transportRead(topicId: string): DouyinDetailPubSub | undefined {
        return this.transportContext.read(topicId);
      }

      private stateMutate(mutator: (state: DouyinDetailStoreShape) => void) {
        this.setState((state) => mutator(state.douyinDetail));
      }

      private getSectionState() {
        return this.getState().douyinDetail;
      }

      private errorTextSet(message: string) {
        this.stateMutate((state) => {
          state.errorText = message;
        });
      }

      private errorTextClear() {
        this.stateMutate((state) => {
          state.errorText = "";
        });
      }

      private listenersClear() {
        this.offConnected?.();
        this.offSnapshot?.();
        this.offAdded?.();
        this.offError?.();
        this.offConnected = undefined;
        this.offSnapshot = undefined;
        this.offAdded = undefined;
        this.offError = undefined;
      }

      private commentsMerge(nextComments: CommentNode[]) {
        this.stateMutate((state) => {
          const byId = new Map(state.comments.map((item) => [item.id, item]));
          for (const item of nextComments) byId.set(item.id, item);
          state.comments = [...byId.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        });
      }

      private commentAdd(comment: CommentNode) {
        this.stateMutate((state) => {
          const exists = state.comments.some((item) => item.id === comment.id);
          if (exists) return;
          state.comments.push(comment);
          state.comments.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        });
      }

      connect(topicId: string): () => void {
        const normalizedTopicId = topicId.trim();
        if (!normalizedTopicId) {
          this.errorTextSet("topicId is required");
          return () => undefined;
        }

        const transport = this.transportRead(normalizedTopicId);
        if (!transport) {
          this.errorTextSet("transport not initialized");
          return () => undefined;
        }

        this.listenersClear();
        this.stateMutate((state) => {
          state.topicId = normalizedTopicId;
          state.connectionId = "";
          state.comments = [];
          state.errorText = "";
          state.isConnected = false;
        });

        this.offConnected = transport.subscribe("detail.connected", (notice) => {
          this.stateMutate((state) => {
            state.connectionId = notice.connectionId;
            state.isConnected = true;
          });
        });

        this.offSnapshot = transport.subscribe("detail.snapshot", (notice) => {
          this.commentsMerge(notice.comments);
        });

        this.offAdded = transport.subscribe("detail.added", (notice) => {
          this.commentAdd(notice.comment);
        });

        this.offError = transport.subscribe("detail.error", (notice) => {
          this.errorTextSet(notice.message);
        });

        transport
          .publish("detail.connect", {
            topicId: normalizedTopicId,
          })
          .catch((error) => {
            this.errorTextSet(error instanceof Error ? error.message : String(error));
          });

        return () => {
          this.listenersClear();
          this.stateMutate((state) => {
            state.isConnected = false;
            if (state.topicId === normalizedTopicId) {
              state.connectionId = "";
            }
          });
        };
      }

      async send() {
        const section = this.getSectionState();
        const transport = this.transportRead(section.topicId);
        if (!transport || section.isSending) return;

        const content = section.draftText.trim();
        if (!content) return;

        this.stateMutate((state) => {
          state.isSending = true;
          state.errorText = "";
        });

        try {
          await transport.publish("detail.message.send", { content });
          this.stateMutate((state) => {
            state.draftText = "";
          });
        } catch (error) {
          this.errorTextSet(error instanceof Error ? error.message : String(error));
        } finally {
          this.stateMutate((state) => {
            state.isSending = false;
          });
        }
      }

      async reply() {
        const section = this.getSectionState();
        const transport = this.transportRead(section.topicId);
        if (!transport || section.isSending) return;

        const content = section.draftText.trim();
        const targetId = section.selectedCommentId.trim();
        if (!content || !targetId) return;

        this.stateMutate((state) => {
          state.isSending = true;
          state.errorText = "";
        });

        try {
          await transport.publish("detail.reply.send", {
            targetId,
            content,
          });
          this.stateMutate((state) => {
            state.draftText = "";
            state.selectedCommentId = "";
          });
        } catch (error) {
          this.errorTextSet(error instanceof Error ? error.message : String(error));
        } finally {
          this.stateMutate((state) => {
            state.isSending = false;
          });
        }
      }

      draftSet(content: string) {
        this.stateMutate((state) => {
          state.draftText = content;
        });
      }

      draftAppend(content: string) {
        this.stateMutate((state) => {
          const previous = state.draftText.trim();
          state.draftText = previous ? `${previous}\n${content}` : content;
        });
      }

      select(commentId: string) {
        this.stateMutate((state) => {
          state.selectedCommentId = commentId;
        });
      }

      clearSelection() {
        this.stateMutate((state) => {
          state.selectedCommentId = "";
        });
      }

      toActions() {
        return this.actions;
      }
    }

    const transportContext = {
      read(topicId: string) {
        return context.read(topicId);
      },
    } satisfies TransportContext;

    const storeInstance = new DouyinDetailStore(transportContext, setRoot, getRoot);

    return {
      douyinDetail: {
        topicId: storeInstance.topicId,
        connectionId: storeInstance.connectionId,
        isConnected: storeInstance.isConnected,
        isSending: storeInstance.isSending,
        draftText: storeInstance.draftText,
        selectedCommentId: storeInstance.selectedCommentId,
        comments: storeInstance.comments,
        errorText: storeInstance.errorText,
        actions: storeInstance.toActions(),
      },
    };
  };
};
