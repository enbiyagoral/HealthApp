class Response {
    constructor(status, message = null, data = null){
        this.status = status;
        this.message = message;
        this.data = data;
    };

    success(res){
        return res.status(200).json({
            success : true,
            message : this.message ?? "Successful",
            data : this.data,
        })
    };

    created(res){
        return res.status(201).json({
            success : true,
            message : this.message ?? "Successful",
            data : this.data,
        })
    };

    error500(res){
        return res.status(500).json({
            success: false,
            message: this.message ?? "Internal Server Error. Please try again later or contact our support team.",
            data: this.data
        })
    };

    error404(res){
        return res.status(404).json({
            success: false,
            message: this.message ?? "Resource not found. The requested resource does not exist.",
            data: this.data
        })
    };

    error400(res){
        return res.status(400).json({
            success: false,
            message: this.message ?? "Bad request",
            data: this.data
        })
    };

    unauthorized(res) {
        return res.status(401).json({
          success: false,
          message: this.message ?? "Unauthorized: You are not authorized to perform this action.",
          data: this.data,
        });
    };

};

module.exports = Response;
