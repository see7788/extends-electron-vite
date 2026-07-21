import type { StateCreator } from "zustand";
import type { PlaceholderContext, PlaceholderPubSub } from "./types";

type TransportContext = Pick<PlaceholderContext, "read">;
type SetRoot = (recipe: (state: UserAppRootState) => void) => void;
type GetRoot = () => UserAppRootState;

type PlaceholderActions = {
  connect(topicId: string): () => void;
  sendPing(): void;
};

export type PlaceholderStoreShape = {
  topicId: string;
  message: string;
  actions: PlaceholderActions;
};

type UserAppRootState = {
  placeholder: PlaceholderStoreShape;
};

export default (context: TransportContext): StateCreator<UserAppRootState> => {
  return (set, get) => {
    const setRoot = set as SetRoot;
    const getRoot = get as GetRoot;

    class PlaceholderStore {
      topicId = "";
      message = "";

      private offPong: (() => void) | undefined;

      private readonly actions: PlaceholderActions = {
        connect: this.connect.bind(this),
        sendPing: this.sendPing.bind(this),
      };

      constructor(
        private readonly transportContext: TransportContext,
        private readonly setState: SetRoot,
        private readonly getState: GetRoot,
      ) {}

      private transportRead(topicId: string): PlaceholderPubSub | undefined {
        return this.transportContext.read(topicId);
      }

      private setSection(mutator: (state: PlaceholderStoreShape) => void) {
        this.setState((state) => mutator(state.placeholder));
      }

      private connect(topicId: string) {
        const normalizedTopicId = topicId.trim();
        if (!normalizedTopicId) {
          this.setSection((state) => {
            state.message = "topicId is required";
          });
          return () => undefined;
        }

        const transport = this.transportRead(normalizedTopicId);
        if (!transport) {
          this.setSection((state) => {
            state.message = "transport not initialized";
          });
          return () => undefined;
        }

        this.offPong?.();
        this.setSection((state) => {
          state.topicId = normalizedTopicId;
          state.message = "waiting pong...";
        });

        this.offPong = transport.subscribe("placeholder.pong", () => {
          this.setSection((state) => {
            state.message = "pong received";
          });
        });

        void transport.publish("placeholder.ping", {
          topicId: normalizedTopicId,
        });

        return () => {
          this.offPong?.();
          this.offPong = undefined;
          this.setSection((state) => {
            state.message = `disconnected: ${normalizedTopicId}`;
          });
        };
      }

      private sendPing() {
        const section = this.getState().placeholder;
        const transport = this.transportRead(section.topicId);
        if (!transport) return;

        void transport.publish("placeholder.ping", {
          topicId: section.topicId,
        });
      }

      toActions() {
        return this.actions;
      }
    }

    const transportContext = {
      read(topicId) {
        return context.read(topicId);
      },
    } satisfies TransportContext;

    const storeInstance = new PlaceholderStore(transportContext, setRoot, getRoot);

    return {
      placeholder: {
        topicId: storeInstance.topicId,
        message: storeInstance.message,
        actions: storeInstance.toActions(),
      },
    };
  };
};
