import { getTopics } from "@/lib/data/topics";
import { TopicForm } from "@/components/topic-form";

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Topics</h1>
        <p className="text-sm text-neutral-500">
          Categories you write in. Pick one when creating a piece.
        </p>
      </div>

      <TopicForm />

      {topics.length === 0 ? (
        <p className="text-sm text-neutral-500">No topics yet.</p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
          {topics.map((topic) => (
            <li key={topic.id} className="px-4 py-3">
              <p className="font-medium">{topic.name}</p>
              {topic.description && (
                <p className="text-sm text-neutral-500">{topic.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
