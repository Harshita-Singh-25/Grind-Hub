import Problem from "../models/problem.model.js";

export const getProblems = async (req, res) => {
  try {
    const { search, difficulty, category, sortBy = 'newest' } = req.query;
    let filter = {};
    
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [search] } }
      ];
    }

    let sortOptions = {};
    switch(sortBy) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'popular':
        sortOptions = { likes: -1, submissions: -1 };
        break;
      case 'difficulty':
        sortOptions = { difficulty: 1, createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const problems = await Problem.find(filter)
      .populate('createdBy', 'fullName profilePic')
      .sort(sortOptions);

    res.status(200).json(problems);
  } catch (error) {
    console.log("Error in getProblems controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProblem = async (req, res) => {
  try {
    const problemId = req.params.id;
    const problem = await Problem.findById(problemId)
      .populate('createdBy', 'fullName profilePic');

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.log("Error in getProblem controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProblem = async (req, res) => {
  try {
    const {
      title, description, difficulty, category, tags, companies,
      examples, constraints, hints, solution
    } = req.body;

    const problem = new Problem({
      title,
      description,
      difficulty,
      category,
      tags,
      companies,
      examples,
      constraints,
      hints,
      solution,
      createdBy: req.user._id
    });

    await problem.save();
    await problem.populate('createdBy', 'fullName profilePic');

    res.status(201).json(problem);
  } catch (error) {
    console.log("Error in createProblem controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeProblem = async (req, res) => {
  try {
    const problemId = req.params.id;
    
    const problem = await Problem.findByIdAndUpdate(
      problemId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.status(200).json({ message: "Problem liked successfully" });
  } catch (error) {
    console.log("Error in likeProblem controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};