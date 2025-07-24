import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js"


const generateAccessTokenandRefreshToken = async (userId) => {
    try {
        console.log("came here at generation of tojkens method");
        console.log(userId);
        
        const user = await User.findById(userId); 
        
        if (!user) throw new ApiError(404, "User not found");

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken(); 
        console.log(`access are ${accessToken}`);
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        console.log(accessToken, refreshToken);
        
        return { accessToken, refreshToken };
    } catch (error) {
        console.log("some error", error);
        
    }
};


const registerUser = asyncHandler(async(req, res) => {
    console.log("came here at register user controller");
    const { name, email, Phone_no, password, role } = req.body;
    
    // Validation
    if (name == "" || email == "" || Phone_no == "" || password == "" || role == "") {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const userExist = await User.findOne({
        $or: [{ name }, { email }]
    });
    if (userExist) {
        return res.status(409).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        Phone_no,
        password,
        role
    });

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id);

    // Get user without sensitive information
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        return res.status(500).json({ message: "User not created" });
    }

    // Set cookies
    const options = {
        httpOnly: true,
        secure: true,        // Keep this for HTTPS
        sameSite: 'none'     // Critical for cross-site cookies
      };
      

      return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .cookie("role", createdUser.role, options)
      .json(new ApiResponse(201, { user: createdUser }, "User registered successfully"));
    
});

export { registerUser }