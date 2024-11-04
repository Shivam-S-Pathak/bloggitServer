import journalpost from "../model/journal.js";

export const journal = async (request, response) => {
  try {
    const { mood, tag, title, body, date, username } = request.body;
    const post = new journalpost({
      mood,
      tag,
      title,
      body,
      date,
      username,
    });
    await post.save();
    return response.status(200).json({ msg: "journal saved successfully" });
  } catch (error) {
    return response.status(500).json(error.code);
  }
};

export const getJournals = async (request, response) => {
  try {
    const myJournals = await journalpost.find({
      username: request.query.username,
    });

    return response.status(200).json(myJournals);
  } catch (error) {
    return response.status(500).json({ msg: error.message });
  }
};

export const getJournaldetails = async (request, response) => {
  try {
    let post = await journalpost.findById(request.params.id);
    return response.status(200).json(post);
  } catch (error) {
    return response.status(500).json({ msg: error.message });
  }
};

export const updateJournal = async (request, response) => {
  try {
    const postId = request.params.id;
    const { title, body, mood, tag, username } = request.body;
    let result = await journalpost.findByIdAndUpdate(
      postId,
      {
        title,
        body,
        mood,
        tag,
        username,
      },
      { new: true }
    );
    if (!result) {
      return response.status(404).json({ msg: "Post not found" });
    }
    return response
      .status(200)
      .json({ msg: "Post updated successfully", post: result });
  } catch (error) {
    return response.status(500).json({ msg: error.message });
  }
};

export const deleteJournal = async (request, response) => {
  try {
    const postId = request.params.id;
    const result = await journalpost.findByIdAndDelete(postId);

    if (!result) {
      return response.status(404).json({ msg: "Post not found" });
    }

    response.status(200).json({ msg: "Post deleted successfully" });
  } catch (error) {
    response.status(500).json({ msg: error.message });
  }
};
